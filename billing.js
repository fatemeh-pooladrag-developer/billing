
let table = document.querySelector("table");
reload()

function getData() {
    return JSON.parse(localStorage.getItem("BILL_DATA"))
}

function updateChart() {
    let dateValues = [];
    let incomeValues = [];
    let expensesValues = [];
    let formatedDateArray = []
    let data = getData();
    if (data) {
        for (i = 0;i < data.length;i++) {
            dateValues.push(data[i].date)
        }
        dateValues.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        for (el of dateValues) {
            formatedDateArray.push(convertDateForChart(el));
        }
        formatedDateArray = [...new Set(formatedDateArray)];
        for (i = 0;i < formatedDateArray.length;i++) {
            let thisDateData = data.filter(row => {
                return convertDateForChart(row.date) === formatedDateArray[i]
            })
            let thisDateIncome = thisDateData.filter(row => {
                return row.type === "income"
            })
            let thisDateExpenses = thisDateData.filter(row => {
                return row.type === "expenses"
            })

            if (thisDateIncome.length > 1) {
                const sum = thisDateIncome.reduce(
                    (previousValue, currentValue) => previousValue + Number(currentValue.amount),
                    0
                );
                incomeValues[i] = sum;

            } else {

                if (thisDateIncome.length === 0) {
                    incomeValues[i] = '';
                } else {
                    incomeValues[i] = thisDateIncome[0].amount;
                }

            }

            if (thisDateExpenses.length > 1) {
                const sum = thisDateExpenses.reduce(
                    (previousValue, currentValue) => previousValue + Number(currentValue.amount),
                    0
                );
                expensesValues[i] = sum;

            } else {
                if (thisDateExpenses.length === 0) {
                    expensesValues[i] = '';
                } else {
                    expensesValues[i] = thisDateExpenses[0].amount;
                }

            }

        }

    }

    new Chart("myChart", {
        type: "line",
        data: {
            labels: formatedDateArray,
            datasets: [{
                label: 'هزینه',
                data: expensesValues,
                borderColor: "#E03F3F",
                fill: false,
                backgroundColor: "#E03F3F "
            }, {
                label: 'درآمد',
                data: incomeValues,
                borderColor: "#2CBE26",
                fill: false,
                backgroundColor: "#2CBE26",

            }]
        },
        options: {
            legend: {
                position: 'bottom',
            }
        }
    });

}



function updateAmount() {
    let data = getData();
    if (data) {
        let income = data.filter(row => {
            return row.type === "income"
        })
        let expenses = data.filter(row => {
            return row.type === "expenses"
        })
        const sumIcome = income.reduce(
            (previousValue, currentValue) => previousValue + Number(currentValue.amount),
            0
        );
        const sumExpenses = expenses.reduce(
            (previousValue, currentValue) => previousValue + Number(currentValue.amount),
            0
        );
        let currentExpenses = document.getElementById('expenses_number');
        currentExpenses.textContent = Number(sumExpenses).toLocaleString('ar-EG')

        let currentIncome = document.getElementById('income_number');
        currentIncome.textContent = Number(sumIcome).toLocaleString('ar-EG')
    }

}


function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    data.forEach(function (element, i) {
        let row = table.insertRow();
        const reversedKeysElement = Object.keys(element).reverse();
        for (key of reversedKeysElement) {
            let cell = row.insertCell();
            if (key === "description") {
                let div = document.createElement('div');
                div.innerHTML = '<button id="delete_button" type="button" onclick="showDeleteConfirmation(' + element["id"] + ')">حذف</button > <button id="show_details_button" type="button" onclick="showDetails(' + element["id"] + ')">نمایش</button';
                cell.appendChild(div);
            } else {
                let value = element[key];
                if (key === "id") {
                    value = convertToPersianNumber((i + 1).toString())
                } else if (key === "amount") {
                    value = Number(value).toLocaleString('ar-EG') + " تومان  "
                } else if (key === "type") {
                    value = element['type'] === "expenses" ? "هزینه" : "درآمد";
                } else if (key === "date") {
                    value = convertDateForTable(value);
                }
                let container = document.createElement("span");
                let text = document.createTextNode(value);
                container.appendChild(text);
                container.style.color = key === "type" ? element['type'] === "expenses" ? "#E03F3F" : "#2CBE26" : "gray";
                cell.appendChild(container);
            }

        }
    });


}


function showDetails(id) {
    let data = getData();
    let row = data.filter(row => {
        return row.id === id
    })
    Swal.fire({
        title: row[0].description !== "" ? row[0].description : "توضیحاتی برای این ثبت موجود نمی باشد",
        icon: 'info',
        iconHtml: '!',
        confirmButtonText: 'بازگشت',
        confirmButtonColor: '#3190FF',
        showCloseButton: true,

    })

}

function deleteRow(id) {
    let data = getData();
    let updatedData = data.filter(row => {
        return row.id !== id
    })
    localStorage.setItem("BILL_DATA", JSON.stringify(updatedData))
    reload()
}

function updateTable() {
    table.innerHTML = "";
    let headData = ["توضیحات", "نوع هزینه", "تاریخ", "مبلغ", "ردیف"];
    let data = getData();
    generateTable(table, data);
    data.length > 0 && generateTableHead(table, headData);

}




function handleTypeBill(myRadio) {
    document.getElementById("amount_show").style.color = myRadio.value === "expenses" ? "#E03F3F" : "#2CBE26"
}

function Num2persian(num) {
    let newNum = num.toString().replace(/[0-9]/g, c => String.fromCharCode(c.charCodeAt(0) + 1728))
    return newNum
}

function number2letterfa() {
    let amount = document.getElementById('amount').value;
    document.getElementById('amount').value = amount.toLocaleString('ar-EG')
    document.getElementById("amount_show").innerHTML = wordifyfa(amount) + "تومان";
}




function addBill() {

    let type = document.querySelector('input[name="type_bill"]:checked').value;
    let amount = document.getElementById('amount').value;
    let date_day = ('0' + document.getElementById('bill_date_day').value).slice(-2);
    let date_month = ('0' + document.getElementById('bill_date_month').value).slice(-2);
    let date_year = document.getElementById('bill_date_year').value;
    let description = document.getElementById('description').value;

    if (amount < 0 || amount === "") {
        showValidaitionError("مبلغ وارد شده صحیح نمی باشد")
    } else if (date_day < 1 || date_day > 31 || date_month < 1 || date_month > 12 || date_year < 1350 || date_year > 1450) {
        showValidaitionError("تاریخ وارد شده صحیح نمی باشد")
    } else {
        let allRowData = {
            'id': Date.now(),
            'amount': amount,
            'date': date_month + "/" + date_day + "/" + date_year,
            'type': type,
            'description': description,
        };

        let data = getData();
        data = data ? data.concat([allRowData]) : [allRowData];
        localStorage.setItem("BILL_DATA", JSON.stringify(data))
        reload()
    }
}


function reload() {
    updateChart()
    updateAmount()
    updateTable()
    clearForm()
}


function convertMonth(num) {
    let months = new Array("فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور", "مهر", "آبان", "آذر", "دي", "بهمن", "اسفند");
    return months[Number(num) - 1]
}

function convertDateForChart(value) {
    const array = value.split("/");
    return convertToPersianNumber(array[2].slice(-2) + convertMonth(array[0]));
}


function clearForm() {
    document.getElementById('income_radio_button').checked = true;
    document.querySelector('input[name="type_bill"]:checked').value === "income";
    document.getElementById('amount').value = "";
    document.getElementById('bill_date_day').value = "";
    document.getElementById('bill_date_month').value = "";
    document.getElementById('bill_date_year').value = "";
    document.getElementById('description').value = "";
    document.getElementById("amount_show").innerHTML = "صفر تومان";
    document.getElementById("amount_show").style.color = "#2CBE26";

}

function convertDateForTable(value) {
    const array = value.split("/");
    return convertToPersianNumber(array[2] + "/" + array[0] + "/" + array[1]);
}


function convertToPersianNumber(str) {
    return str.replace(/[0-9]/g, c => String.fromCharCode(c.charCodeAt(0) + 1728))
}


function showDeleteConfirmation(id) {
    Swal.fire({
        title: "آیا مطمئن هستید؟",
        icon: 'question',
        iconHtml: '؟',
        confirmButtonText: 'حذف',
        cancelButtonText: 'بازگشت',
        confirmButtonColor: '#D55F5F',
        cancelButtonColor: '#3190FF',
        showCancelButton: true,
        showCloseButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            deleteRow(id)
        }
    })

}

function showValidaitionError(err) {
    Swal.fire({
        title: err,
        icon: 'warning',
        iconHtml: '!',
        confirmButtonText: 'بازگشت',
        confirmButtonColor: '#3190FF',
        showCloseButton: true,

    })

}



















