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
  let transactions = [];
  //main submit listener
  form.addEventListener("submit", function(event){

    event.preventDefault();
    addTransaction();
  });


  //getting values from inputs
  function addTransaction(){
    const transaction = {

    id: Date.now(),  //imp new id set by time stamps

    description: descriptionInput.value.trim(),
      
    amount: Number(amountInput.value),
        
    category: categoryInput.value,
    
    type: typeInput.value,
    
    date: dateInput.value,
    
    note: noteInput.value.trim()
    };

    transactions.push(transaction);
    console.log(transactions);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    form.reset();

    dateInput.valueAsDate = new Date();

};
  