var host = "http://localhost:3000";
var months = [
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
var categories = [];
var summaryData;
function setDate() {
  let date = new Date();
  let formattedDate = `${date.getFullYear()}-${Number(date.getMonth() + 1)
    .toString()
    .padStart(2, 0)}-${date.getDate().toString().padStart(2, 0)}`;
  document.getElementById("transDate").value = formattedDate;
}
function loadCategories() {
  fetch(`${host}/categories`)
    .then((res) => res.json())
    .then((data) => {
      for (let category of data) {
        categories = data;
        document.getElementById("transCategory").innerHTML += `
        <option style = 'background-color:${category.color}'>${category.name}</option>`;
      }
    });
}
// loadCategories();
function loadTranSHistory() {
  let income = 0;
  let expense = 0;
  fetch(`${host}/transactions`)
    .then((res) => res.json())
    .then((data) => {
      data = [...data].reverse();
      for (trans of data) {
        if (trans.type.toLowerCase() == "income") {
          income += Number(trans.amount);
        } else if (trans.type.toLowerCase() == "expense") {
          expense += Number(trans.amount);
        } else {
          console.log(trans);
        }
        document.getElementById("transHistory").innerHTML += `
            <tr key = '${trans.id}'>
                <td>${trans.date}</td>
                <td>${trans.description}</td>
                <td>
                    <span class = 'category' style = 'background-color:${
                      trans.categoryColor
                    }'>
                    ${trans.category}
                    </span>
                </td>

                <td class = ${
                  trans.type.toLowerCase() == "income" ? "good" : "bad"
                }>${trans.type.toLowerCase() == "income" ? "+" : "-"}$${
          trans.amount
        }</td>
            </tr>
            `;
      }
      document.getElementById("income").innerHTML = income.toFixed(2);
      document.getElementById("expense").innerHTML = expense.toFixed(2);
      document.getElementById("balance").innerHTML = Number(
        income - expense
      ).toFixed(2);
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
      let date = new Date();
      document.getElementById("date").innerHTML = `${
        months[date.getMonth()]
      } - ${date.getFullYear()} `;
      //   document.getElementById("balance").innerHTML = `$${data.currentBalance}`;
      //   document.getElementById("income").innerHTML = `$${data.monthlyIncome}`;
      //   document.getElementById("expense").innerHTML = `$${data.monthlyExpenses}`;
      //   document.getElementById("savings").innerHTML = `$${data.savingsProgress}`;
      //   document.getElementById(
      //     "budgetRemaining"
      //   ).innerHTML = `${data.budgetRemaining}%`;
    });
}
function addTrans() {
  let amount = Number(document.getElementById("transAmount").value);
  let type = document.getElementById("transType").value;
  let category = document.getElementById("transCategory").value;
  let date = document.getElementById("transDate").value;
  let description = document.getElementById("transDescription").value;
  let categoryColor = categories.find((cate) => (cate.name = category))?.[
    "color"
  ];
  document.getElementById("transHistory").innerHTML =
    `
  <tr>
      <td>${date}</td>
      <td>${description}</td>
      <td>
          <span class = 'category' style = 'background-color:${categoryColor}'>
          ${category}
          </span>
          </td>
      <td>${amount}</td>
      </tr>
      ` + document.getElementById("transHistory").innerHTML;
  if (type == "Expense") {
    document.getElementById("expense").innerHTML =
      parseInt(document.getElementById("expense").innerHTML) + amount;
    document.getElementById("balance").innerHTML =
      parseInt(document.getElementById("balance").innerHTML) - amount;
  } else if (type == "Income") {
    document.getElementById("income").innerHTML =
      parseInt(document.getElementById("income").innerHTML) + amount;
    document.getElementById("balance").innerHTML =
      parseInt(document.getElementById("balance").innerHTML) + amount;
  }
  //   updateSummary()
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
  [amount, description] = ["", ""];
}

setDate();
loadSummary();
loadCategories();
loadTranSHistory();
