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
  fetch(`${host}/transactions`)
    .then((res) => res.json())
    .then((data) => {
      data = [...data].reverse();
      for (trans of data) {
        document.getElementById("transHistory").innerHTML += `
            <tr>
                <td>${trans.date}</td>
                <td>${trans.description}</td>
                <td>
                    <span class = 'category' style = 'background-color:${trans.categoryColor}'>
                    ${trans.category}
                    </span>
                </td>

                <td class = ${trans.type == 'Income'?'good':'bad'}>${trans.type =='Income'?'+':'-'}$${trans.amount}</td>
            </tr>
            `;
      }
    });
}

function loadSummary() {
  fetch(`${host}/summaryData`)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      document.getElementById("date").innerHTML = `${
        months[date.getMonth()]
      } - ${date.getFullYear()} `;
      document.getElementById("balance").innerHTML = `$${data.currentBalance}`;
      document.getElementById('income').innerHTML = `$${data.monthlyIncome}`
      document.getElementById('expense').innerHTML = `$${data.monthlyExpenses}`
      document.getElementById('savings').innerHTML = `$${data.savingsProgress}`
      document.getElementById('budgetRemaining').innerHTML = `${data.budgetRemaining}%`
      console.log(data);
    });
}
function addTrans() {
  let amount = document.getElementById("transAmount").value;
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
