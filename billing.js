var dateValues = ['', 200, 300, 400, 500, 600, 700, 800, 900, 1000];
var incomeValues = [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478];
var expensesValues = [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000];

new Chart("myChart", {
    type: "line",
    data: {
        labels: dateValues,
        datasets: [{
            data: incomeValues,
            borderColor: "#E03F3F",
            fill: false
        }, {
            data: expensesValues,
            borderColor: "#2CBE26",
            fill: false
        }]
    },
    options: {
        legend: {
            position: 'bottom'
        }
    }
});

//adding seperate camma by 3 number 
var expenses = document.getElementById("expenses_number");
expenses.textContent = Number(expenses.textContent).toLocaleString('ar-EG')


var income = document.getElementById("income_number");
income.textContent = Number(income.textContent).toLocaleString('ar-EG')


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


function myFunction() {
    let type = document.querySelector('input[name="type_bill"]:checked').value;
    let amount = document.getElementById('amount').value;
    let date_day = document.getElementById('bill_date_day').value;
    let date_month = document.getElementById('bill_date_month').value;
    let date_year = document.getElementById('bill_date_year').value;
    let description = document.getElementById('description').value;

}