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

let selectedTypo = "";
const typeButtons =
    document.querySelectorAll(".type-btn");

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

        id: Date.now(),  //imp new id set by time stamps

        description: description,

        amount: amount,

        category: categoryInput.value,

        type: selectedTypo,

        date: dateInput.value,

        note: noteInput.value.trim()
    };

    transactions.push(transaction);
    console.log(transactions);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    form.reset();

    dateInput.valueAsDate = new Date();

    renderTransactions();
    updateBalance();

}


//rendering UI
console.log("transactions:", transactions);
console.log("length:", transactions.length);

function renderTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        emptyState.style.display = "block";
        console.log("hola")
        return;
    }
    else {
        emptyState.style.display = "none";
    }

    transactions.forEach(function (transaction) {

        const transactionItem = document.createElement("div");
        transactionItem.classList.add("transaction-item");
        transactionItem.classList.add(transaction.type);

        //main adding html

        transactionItem.innerHTML = `
  
            <div class="transaction-left">

            <h3>
            ${transaction.description}
            </h3>

            <div class="transaction-meta">

            <span class="category-tag">
            ${transaction.category}
            </span>

            <span>
            ${transaction.date}
            </span>

            </div>

            ${transaction.note ? `<p class="transaction-note"> ${transaction.note}</p>` : ""}
          

            </div>

            <div class="transaction-right">

            <h3>
            ${transaction.type === "expense"
                ? "-"
                : "+"
            }₹${transaction.amount}
            </h3>

            <button class="delete-btn" data-id="${transaction.id}">Delete</button>
    
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
    console.log(transactions.length);
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
    let income = 0;
    let expense = 0;

    transactions.forEach(function (transaction) {

        if (transaction.type === "Income") {
            income += transaction.amount;
        }
        else if (transaction.type === "Expense") {
            expense += transaction.amount;
        }

    });

    let balance = income - expense;

    incomeEl.textContent = "₹" + income.toLocaleString("en-IN");
    expenseEl.textContent = "₹" + expense.toLocaleString("en-IN");
    totalEl.textContent = "₹" + balance.toLocaleString("en-IN");

    if (balance < 0) {
        totalEl.style.color = "#ef4444";
    }
    else {
        totalEl.style.color = "#22c55e";
    }

}

//for filters and search

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



renderTransactions();
updateBalance();


