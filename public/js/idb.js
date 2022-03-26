// create variable to hold db connection
let db;
// establish a connection to IndexedDB database 'budget_tracker' and set it to version 1
const req = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    // save reference to db 
    const db = event.target.result;
    // create an object store called `budget`
    db.createObjectStore('budget', { autoincrement: true });
};

// upon a successful 
request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
      // we haven't created this yet, but we will soon, so let's comment it out for now
      // uploadPizza();
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

  function saveRecord(record) {
      // open new transaction with db
      const transaction = db.transaction(['budget'], 'readWrite');

      // access object store
      const budgetObjectStore = transaction.objectStore('budget');

      // add record to object store
      budgetObjectStore.add(record);
  }