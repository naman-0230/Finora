//DOM selection 
const form =
    document.querySelector("#transaction-form");

const descriptionInput =
    document.querySelector("#description");

const amountInput =
    document.querySelector("#amount");

const categoryInput =
    document.querySelector("#category");

const typeInput =
    document.querySelector("#type");

let selectedTypo = "income";
const typeButtons =
    document.querySelectorAll(".type-btn");

typeButtons.forEach(function (btn) {

    if (btn.dataset.type === "income") {
        btn.classList.add("active");
    }

});

const dateInput =
    document.querySelector("#date");

const noteInput =
    document.querySelector("#note");

const transactionList =
    document.querySelector(".transaction-list");

const emptyState =
    document.querySelector(".empty-state");

//for default date of today
dateInput.valueAsDate = new Date();

//main storing array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

//main submit listener
form.addEventListener("submit", function (event) {

    event.preventDefault();
    addTransaction();

});
//income expense buttons
typeButtons.forEach(function (btn) {

    btn.addEventListener("click", function () {

        selectedTypo = btn.dataset.type;

        typeButtons.forEach(function (b) {
            b.classList.remove("active");
        });

        btn.classList.add("active");

    });

});

//getting values from inputs
function addTransaction() {
    //minimal validation for now 
    const description = descriptionInput.value.trim();

    const amount = Number(amountInput.value);

    if (!description || !amount || amount <= 0) {
        alert("Please enter valid transaction details.");
        return;
    }


    //normal object creation
    const transaction = {

        id: editTransactionId || Date.now(),      //imp new id set by time stamps

        description: description,

        amount: amount,

        category: categoryInput.value,

        type: selectedTypo,

        date: dateInput.value,

        note: noteInput.value.trim()
    };
    //for updating existing value if there is edit
    if (editTransactionId) {

        transactions = transactions.map(function (targetTransaction) {

            if (targetTransaction.id === editTransactionId) {
                return transaction;
            }

            return targetTransaction;
        });
    }
    else {
        transactions.push(transaction);
    }

    console.log(transactions);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    form.reset();

    dateInput.valueAsDate = new Date();

    renderTransactions();
    updateBalance();
    renderExpenseChart();
    renderComparisonChart();
    renderTrendChart();

    selectedTypo = "income";

    typeButtons.forEach(function (btn) {

        if (btn.dataset.type === "income") {
            btn.classList.add("active");
        }
        else {
            btn.classList.remove("active");
        }

    });


    //for resetting edit button
    editTransactionId = null;

    document.querySelector(".submit-btn").textContent = "Add Transaction";

}


//rendering UI
console.log("transactions:", transactions);
console.log("length:", transactions.length);

function renderTransactions() {

    transactionList.innerHTML = "";

    // STEP 7 FIX: use filtered data instead of raw array
    const filtered = getFilteredTransactions();

    if (filtered.length === 0) {
        emptyState.style.display = "block";
        console.log("hola");
        updateBalance(); // still update balance even if empty
        return;
    }
    else {
        emptyState.style.display = "none";
    }

    filtered.forEach(function (transaction) {

        const transactionItem = document.createElement("div");
        transactionItem.classList.add("transaction-item");
        if (transaction.type) {

            transactionItem.classList.add(transaction.type);

        }

        transactionItem.innerHTML = `
  
            <div class="transaction-left">

                <h3>${transaction.description}</h3>

                <div class="transaction-meta">

                    <span class="category-tag">
                        ${transaction.category}
                    </span>

                    <span>
                        ${transaction.date}
                    </span>

                </div>

                ${transaction.note ? `<p class="transaction-note">${transaction.note}</p>` : ""}

            </div>

            <div class="transaction-right">

                <h3>
                    ${transaction.type === "expense" ? "-" : "+"}₹${transaction.amount}
                </h3>

                <button class="edit-btn" data-id="${transaction.id}">
                    Edit
                </button>    
                <button class="delete-btn" data-id="${transaction.id}">
                    Delete
                </button>

            </div>
        `;

        transactionList.appendChild(transactionItem);
    });

    console.log("incomeEl:", incomeEl);
    console.log("expenseEl:", expenseEl);
    console.log("totalEl:", totalEl);

    updateBalance();
}

transactionList.addEventListener("click", function (e) {

    if (e.target.classList.contains("delete-btn")) {

        const item = e.target.closest(".transaction-item");

        item.style.transform = "translateX(20px)";
        item.style.opacity = "0";

        setTimeout(() => {

            const id = Number(e.target.dataset.id);
            deleteTransaction(id);

        }, 400);
    }

});

function deleteTransaction(id) {

    transactions = transactions.filter(function (transaction) {
        return transaction.id !== id;
    });

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    renderTransactions();
    updateBalance();
    renderExpenseChart();
    renderComparisonChart();
    renderTrendChart();
    console.log(transactions.length);
}


//FOR EDIT BUTTON
let editTransactionId = null;

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("edit-btn")) {

        const id = Number(event.target.dataset.id);

        editTransaction(id);
    }

});


function editTransaction(id) {

    const Targettransaction = transactions.find(function (t) {
        return t.id === id;
    });

    if (!Targettransaction) {
        return;
    }

    // fill form
    descriptionInput.value = Targettransaction.description;

    amountInput.value = Targettransaction.amount;

    categoryInput.value = Targettransaction.category;

    dateInput.value = Targettransaction.date;

    noteInput.value = Targettransaction.note;

    // type state
    selectedTypo = Targettransaction.type;

    // update active button UI
    typeButtons.forEach(function (btn) {

        btn.classList.remove("active");

        if (btn.dataset.type === Targettransaction.type) {
            btn.classList.add("active");
        }

    });

    // save edit mode
    editTransactionId = id;

    // change submit button text
    document.querySelector(".submit-btn").textContent = "Update Transaction";


    form.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


}



//DOM for balancing

const incomeEl =
    document.querySelector(".income-value");

const expenseEl =
    document.querySelector(".expense-value");

const totalEl =
    document.querySelector(".balance-value");


function updateBalance() {
    console.log("updateBalance running");
    let incomes = 0;
    let expenses = 0;

    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {
            incomes += transaction.amount;
        }
        else if (transaction.type === "expense") {
            expenses += transaction.amount;
        }

    });

    let balance = incomes - expenses;

    incomeEl.textContent = "₹" + incomes.toLocaleString("en-IN");
    expenseEl.textContent = "₹" + expenses.toLocaleString("en-IN");
    totalEl.textContent = "₹" + balance.toLocaleString("en-IN");

    if (balance < 0) {
        totalEl.style.color = "#ef4444";
    }
    else {
        totalEl.style.color = "#22c55e";
    }

}

//FOR FILTERS AND SEARCH

let selectedType = "all";
let selectedCategory = "all";
let searchText = "";

const searchInput = document.querySelector("#search");
const categoryFilter = document.querySelector("#category-filter");
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function (btn) {

    btn.addEventListener("click", function () {

        selectedType = btn.dataset.type;

        filterButtons.forEach(function (b) {
            b.classList.remove("active");
        });

        btn.classList.add("active");

        renderTransactions();
    });

});

categoryFilter.addEventListener("change", function (e) {

    selectedCategory = e.target.value;

    renderTransactions();
});

searchInput.addEventListener("input", function (e) {

    searchText = e.target.value.toLowerCase();

    renderTransactions();
});

function getFilteredTransactions() {

    return transactions.filter(function (t) {

        const matchType =
            selectedType === "all" ||
            t.type === selectedType;

        const matchCategory =
            selectedCategory === "all" ||
            t.category === selectedCategory;

        const desc = t.description.toLowerCase();
        const search = searchText.trim().toLowerCase();

        const matchSearch =
            search === "" ||
            desc.startsWith(search) ||
            desc.includes(search);

        return matchType && matchCategory && matchSearch;
    });
}


let expenseChart;
let comparisonChart;
let trendChart;

function renderExpenseChart() {

    const categoryMap = {};

    transactions.forEach(transaction => {

        if (transaction.type !== "expense") return;

        const category = transaction.category;

        if (categoryMap[category]) {
            categoryMap[category] += transaction.amount;
        }

        else {
            categoryMap[category] = transaction.amount;
        }

    });

    const labels = Object.keys(categoryMap);

    const data = Object.values(categoryMap);

    if (data.length === 0) {

        labels.push("No Data");

        data.push(1);

    }

    const ctx = document.getElementById("expenseChart");



    /*
      CREATE ONLY ONCE
    */

    if (!expenseChart) {

        expenseChart = new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: labels,

                datasets: [{

                    data: data,

                    borderWidth: 0,

                    backgroundColor:

                        data.length === 1 && labels[0] === "No Data"

                            ? [

                                getComputedStyle(document.documentElement)
                                    .getPropertyValue("--chart-empty")

                            ]

                            : [

                                getComputedStyle(document.documentElement)
                                    .getPropertyValue("--chart-1"),

                                getComputedStyle(document.documentElement)
                                    .getPropertyValue("--chart-2"),

                                getComputedStyle(document.documentElement)
                                    .getPropertyValue("--chart-3"),

                                getComputedStyle(document.documentElement)
                                    .getPropertyValue("--chart-4"),

                                getComputedStyle(document.documentElement)
                                    .getPropertyValue("--chart-5"),

                                getComputedStyle(document.documentElement)
                                    .getPropertyValue("--chart-6"),

                                getComputedStyle(document.documentElement)
                                    .getPropertyValue("--chart-7")

                            ]

                }]

            },



            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: {

                    duration: 800

                },

                layout: {

                    padding: 10

                },

                plugins: {

                    legend: {

                        position: "right",

                        align: "center",

                        labels: {

                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue("--secondary-text"),

                            usePointStyle: true,

                            pointStyle: "circle",

                            boxWidth: 10,

                            boxHeight: 10,

                            padding: 14,

                            font: {

                                size: 13,

                                weight: 500,

                                family: "Inter"

                            }

                        }

                    }

                }

            }

        });

    }
    else {

        expenseChart.data.labels = labels;

        expenseChart.data.datasets[0].data = data;

        expenseChart.update();

    }

}

function renderComparisonChart() {

    let income = 0;

    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        }

        else {

            expense += transaction.amount;

        }
    });

    const labels = ["Income", "Expense"];
    const data = [income, expense];
    const ctx = document.getElementById("comparisonChart");
    if (!comparisonChart) {

        comparisonChart = new Chart(ctx, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    data: data,

                    borderRadius: 12,

                    borderSkipped: false,

                    backgroundColor: [

                        "#22c55e",

                        "#ef4444"

                    ]

                }]

            },

            options: {

                responsive: true,
                maintainAspectRatio: false,
                animation: {

                    duration: 800

                },

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    x: {

                        grid: {

                            display: false

                        },

                        ticks: {

                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue("--secondary-text"),

                            font: {

                                size: 13,

                                family: "Inter"

                            }

                        }

                    },
                    y: {

                        grid: {

                            color: "rgba(255,255,255,0.05)"

                        },

                        ticks: {

                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue("--secondary-text"),

                            font: {

                                size: 12,

                                family: "Inter"

                            }

                        }

                    }

                }

            }

        });

    }

    else {

        comparisonChart.data.labels = labels;

        comparisonChart.data.datasets[0].data = data;

        comparisonChart.update();

    }

}

function renderTrendChart() {

    const monthlyMap = {};
    transactions.forEach(transaction => {

        if (transaction.type !== "expense") return;

        const date = new Date(transaction.date);

        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        if (monthlyMap[monthKey]) {

            monthlyMap[monthKey] += transaction.amount;

        }

        else {

            monthlyMap[monthKey] = transaction.amount;

        }

    });

    const sortedMonths = Object.keys(monthlyMap).sort();

    const labels = sortedMonths.map(month => {

        const [year, monthIndex] = month.split("-");

        const date = new Date(year, monthIndex);

        return date.toLocaleString("default", {

            month: "short"

        });

    });

    const data = sortedMonths.map(month => monthlyMap[month]);
    const ctx = document.getElementById("trendChart");
    if (!trendChart) {

        trendChart = new Chart(ctx, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "Monthly Spending",

                    data: data,

                    tension: 0.4,

                    fill: true,

                    borderWidth: 3,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    borderColor: "#3b82f6",

                    backgroundColor: "rgba(59,130,246,0.12)"

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: {

                    duration: 800

                },

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    x: {

                        grid: {

                            display: false

                        },

                        ticks: {

                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue("--secondary-text"),

                            font: {

                                size: 12,

                                family: "Inter"
                            }

                        }

                    },

                    y: {

                        grid: {

                            color: "rgba(255,255,255,0.05)"

                        },

                        ticks: {

                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue("--secondary-text"),

                            font: {

                                size: 12,

                                family: "Inter"

                            }

                        }

                    }

                }

            }

        });

    }

    else {

        trendChart.data.labels = labels;

        trendChart.data.datasets[0].data = data;

        trendChart.update();

    }
}



renderTransactions();
updateBalance();
renderExpenseChart();
renderComparisonChart();
renderTrendChart();

