let table = document.querySelector("table");
reload()

function getData() {
    return JSON.parse(localStorage.getItem("BILL_DATA"))
}

function updateChart() {
    let dateValues = [];
    let incomeValues = [];
    let expensesValues = [];

    let data = getData();
    if (data) {

        for (i = 0;i < data.length;i++) {
            dateValues.push(data[i].date)
        }
        const isDescending = false; //set to false for ascending
        dateValues.sort((a, b) => isDescending ? new Date(b).getTime() - new Date(a).getTime() : new Date(a).getTime() - new Date(b).getTime());

        // uniqe date values
        dateValues = [...new Set(dateValues)];



        for (i = 0;i < dateValues.length;i++) {
            let thisDateData = data.filter(row => {
                return row.date === dateValues[i]
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
    let formatedDateArray = []
    for (el of dateValues) {
        formatedDateArray.push(convertDateForChart(el));
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
        const newElement = Object.fromEntries(
            Object.entries(element).slice(0, 5)
        )
        for (key in newElement) {
            let cell = row.insertCell();
            if (key === "description") {
                let div = document.createElement('div');
                div.innerHTML = '<button id="show_details_button" type="button" onclick="showDetails(' + newElement["id"] + ')">نمایش</button > <button id="delete_button" type="button" onclick="deleteRow(' + newElement["id"] + ')">حذف</button';
                cell.appendChild(div);
            } else {
                let value = newElement[key];
                if (key === "id") {
                    value = i + 1;
                } else if (key === "amount") {

                    value = Number(value).toLocaleString('ar-EG') + " تومان  "

                } else if (key === "type") {
                    value = newElement['type'] === "expenses" ? "هزینه" : "درآمد";
                } else if (key === "date") {
                    value = convertDateForTable(value);
                }
                let text = document.createTextNode(value);

                cell.appendChild(text);
            }

        }
    });


}


function showDetails(id) {
    let data = getData();
    let row = data.filter(row => {
        return row.id === id
    })
    console.log(row)
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
    generateTableHead(table, headData);
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


function reload() {
    updateChart()
    updateAmount()
    updateTable()
    clearForm()
}


function convertMonth(num) {
    switch (num) {
        case "01":
            return "فروردین"
            break;
        case "02":
            return "اردیبهشت"
            break;
        case "03":
            return "خرداد"
            break;
        case "04":
            return "تیر"
            break;
        case "05":
            return "مرداد"
            break;
        case "06":
            return "شهریور"
            break;
        case "07":
            return "مهر"
            break;
        case "08":
            return "آبان"
            break;
        case "09":
            return "آذر"
            break;
        case "10":
            return "دی"
            break;
        case "11":
            return "بهمن"
            break;
        case "12":
            return "اسفند"
            break;
        default:
            return ""
    }
}

function convertDateForChart(value) {
    const array = value.split("/");
    return array[2].slice(-2) + convertMonth(array[0]);
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

}

function convertDateForTable(value) {
    const array = value.split("/");
    return array[2] + "/" + array[0] + "/" + array[1];
}















