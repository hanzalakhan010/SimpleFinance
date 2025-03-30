"use strict";
const host = "http://localhost:3000";
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
let categories = [];
let summaryData;
function setDate() {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${Number(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const transDateInput = document.getElementById("transDate");
    if (transDateInput) {
        transDateInput.value = formattedDate;
    }
}
function loadCategories() {
    fetch(`${host}/categories`)
        .then((res) => res.json())
        .then((data) => {
        categories = data;
        const transCategoryElement = document.getElementById("transCategory");
        if (transCategoryElement) {
            for (let category of data) {
                transCategoryElement.innerHTML += `
          <option style='background-color:${category.color}' value='${category.name}'>${category.name}</option>`;
            }
        }
    });
}
function loadTranSHistory() {
    let income = 0;
    let expense = 0;
    fetch(`${host}/transactions`)
        .then((res) => res.json())
        .then((data) => {
        data = [...data].reverse();
        const transHistoryElement = document.getElementById("transHistory");
        for (let trans of data) {
            if (trans.type.toLowerCase() === "income") {
                income += Number(trans.amount);
            }
            else if (trans.type.toLowerCase() === "expense") {
                expense += Number(trans.amount);
            }
            else {
                console.log(trans);
            }
            transHistoryElement.innerHTML += `
            <tr key='${trans.id}'>
                <td>${trans.date}</td>
                <td>${trans.description}</td>
                <td>
                    <span class='category' style='background-color:${trans.categoryColor}'>
                    ${trans.category}
                    </span>
                </td>
                <td class='${trans.type.toLowerCase() === "income" ? "good" : "bad"}'>${trans.type.toLowerCase() === "income" ? "+" : "-"}$${trans.amount}</td>
            </tr>`;
        }
        document.getElementById("income").innerHTML = income.toFixed(2);
        document.getElementById("expense").innerHTML = expense.toFixed(2);
        document.getElementById("balance").innerHTML = (income - expense).toFixed(2);
    });
}
function updateSummary() {
    fetch(`${host}/summaryData`, {
        method: "PUT",
        body: JSON.stringify(summaryData),
    });
}
function loadSummary() {
    fetch(`${host}/summaryData`)
        .then((res) => res.json())
        .then((data) => {
        summaryData = data;
        const date = new Date();
        document.getElementById("date").innerHTML = `${months[date.getMonth()]} - ${date.getFullYear()}`;
    });
}
function addTrans() {
    var _a;
    const amount = Number(document.getElementById("transAmount").value);
    const type = document.getElementById("transType").value;
    const category = document.getElementById("transCategory").value;
    const date = document.getElementById("transDate").value;
    const description = document.getElementById("transDescription").value;
    const categoryColor = (_a = categories.find((cate) => (cate.name === category))) === null || _a === void 0 ? void 0 : _a.color;
    const transHistoryElement = document.getElementById("transHistory");
    transHistoryElement.innerHTML = `
            <tr>
                <td>${date}</td>
                <td>${description}</td>
                <td>
                    <span class='category' style='background-color:${categoryColor}'>
                    ${category}
                    </span>
                </td>
                <td class='${type.toLowerCase() === "income" ? "good" : "bad"}'>${type.toLowerCase() === "income" ? "+" : "-"}$${amount}</td>
            </tr>` + transHistoryElement.innerHTML;
    if (type === "Expense") {
        document.getElementById("expense").innerHTML = (parseInt(document.getElementById("expense").innerHTML) + amount).toString();
        document.getElementById("balance").innerHTML = (parseInt(document.getElementById("balance").innerHTML) - amount).toString();
    }
    else if (type === "Income") {
        document.getElementById("income").innerHTML = (parseInt(document.getElementById("income").innerHTML) + amount).toString();
        document.getElementById("balance").innerHTML = (parseInt(document.getElementById("balance").innerHTML) + amount).toString();
    }
    fetch(`${host}/transactions`, {
        method: "POST",
        body: JSON.stringify({
            amount,
            type,
            category,
            categoryColor,
            date,
            description,
        }),
    });
    document.getElementById("transAmount").value = "";
    document.getElementById("transDescription").value = "";
}
setDate();
loadSummary();
loadCategories();
loadTranSHistory();
