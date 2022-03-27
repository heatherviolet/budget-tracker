// create variable to hold db connection
let db;
// establish a connection to IndexedDB database 'budget_tracker' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    // save reference to db 
    const db = event.target.result;
    // create an object store called `budget`
    db.createObjectStore('new_budget', { autoincrement: true });
};

// upon a successful 
request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

  function saveRecord(record) {
      // open new transaction with db
      const transaction = db.transaction(['new_budget'], 'readwrite');

      // access object store
      const budgetObjectStore = transaction.objectStore('new_budget');

      // add record to object store
      budgetObjectStore.add(record);
  }

  function uploadBudget() {
      const transaction = db.transaction(['new_budget'], 'readwrite');

      // access pending object store
      const budgetObjectStore = transaction.objectStore('new_budget');

      // get all records from store
      const getAll = budgetObjectStore.getAll();

      getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
          fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(serverResponse => {
              if (serverResponse.message) {
                throw new Error(serverResponse);
              }
    
              const transaction = db.transaction(['new_budget'], 'readwrite');
              const budgetObjectStore = transaction.objectStore('new_budget');
              // clear all items in store
              budgetObjectStore.clear();
            })
            .catch(err => {
              // set reference to redirect back here
              console.log(err);
            });
        }
      };
    }

  window.addEventListener('online', uploadBudget);