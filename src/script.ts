const host: string = "http://localhost:3000";
const months: string[] = [
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
let categories: { name: string; color: string,type:string }[] = [];
let summaryData: any;

function setDate(): void {
  const date: Date = new Date();
  const formattedDate: string = `${date.getFullYear()}-${Number(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  const transDateInput = document.getElementById("transDate") as HTMLInputElement;
  if (transDateInput) {
    transDateInput.value = formattedDate;
  }
}

function loadCategories(): void {
  fetch(`${host}/categories`)
    .then((res) => res.json())
    .then((data: {name: string; color: string,type:string }[]) => {
      categories = data;
      const transCategoryElement = document.getElementById("transCategory") as HTMLSelectElement;
      if (transCategoryElement) {
        for (let category of data) {
          transCategoryElement.innerHTML += `
          <option style='background-color:${category.color}' value='${category.name}'>${category.name}</option>`;
        }
      }
    });
}

function loadTranSHistory(): void {
  let income: number = 0;
  let expense: number = 0;
  fetch(`${host}/transactions`)
    .then((res) => res.json())
    .then((data: any[]) => {
      data = [...data].reverse();
      const transHistoryElement = document.getElementById("transHistory") as HTMLElement;
      for (let trans of data) {
        if (trans.type.toLowerCase() === "income") {
          income += Number(trans.amount);
        } else if (trans.type.toLowerCase() === "expense") {
          expense += Number(trans.amount);
        } else {
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
      (document.getElementById("income") as HTMLElement).innerHTML = income.toFixed(2);
      (document.getElementById("expense") as HTMLElement).innerHTML = expense.toFixed(2);
      (document.getElementById("balance") as HTMLElement).innerHTML = (income - expense).toFixed(2);
    });
}

function updateSummary(): void {
  fetch(`${host}/summaryData`, {
    method: "PUT",
    body: JSON.stringify(summaryData),
  });
}

function loadSummary(): void {
  fetch(`${host}/summaryData`)
    .then((res) => res.json())
    .then((data: any) => {
      summaryData = data;
      const date: Date = new Date();
      (document.getElementById("date") as HTMLElement).innerHTML = `${months[date.getMonth()]} - ${date.getFullYear()}`;
    });
}

function addTrans(): void {
  const amount: number = Number((document.getElementById("transAmount") as HTMLInputElement).value);
  // const type: string = (document.getElementById("transType") as HTMLSelectElement).value;
  const category: string = (document.getElementById("transCategory") as HTMLSelectElement).value;
  const categoryType = categories.find((cate) => (cate.name === category))?.type;
  const type: string = categoryType === "income" ? "Income" : "Expense";
  const date: string = (document.getElementById("transDate") as HTMLInputElement).value;
  const description: string = (document.getElementById("transDescription") as HTMLTextAreaElement).value;
  const categoryColor: string | undefined = categories.find((cate) => (cate.name === category))?.color;

  const transHistoryElement = document.getElementById("transHistory") as HTMLElement;
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
    (document.getElementById("expense") as HTMLElement).innerHTML = (parseInt((document.getElementById("expense") as HTMLElement).innerHTML) + amount).toString();
    (document.getElementById("balance") as HTMLElement).innerHTML = (parseInt((document.getElementById("balance") as HTMLElement).innerHTML) - amount).toString();
  } else if (type === "Income") {
    (document.getElementById("income") as HTMLElement).innerHTML = (parseInt((document.getElementById("income") as HTMLElement).innerHTML) + amount).toString();
    (document.getElementById("balance") as HTMLElement).innerHTML = (parseInt((document.getElementById("balance") as HTMLElement).innerHTML) + amount).toString();
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
  (document.getElementById("transAmount") as HTMLInputElement).value = "";
  (document.getElementById("transDescription") as HTMLTextAreaElement).value = "";
}

setDate();
loadSummary();
loadCategories();
loadTranSHistory();     