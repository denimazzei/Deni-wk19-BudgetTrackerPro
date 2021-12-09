let db;
const request = indexedDB.open("budget", 1);

//creates schema
request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // Creates an object store with a listID keypath that can be used to query on.
  const budgetStore = db.createObjectStore("budget", {
    keyPath: "listID",
  });

  // Creates a statusIndex that we can query on.
  budgetStore.createIndex("statusIndex", "status");
};

const store = transaction.ObjectStore("budgetStore");

const getAll = store.getAll();

getAll.concussess = function () {
  if (getAll.result.length > 0) {
    fetch("/api/transaction/bulk", {
      method: "POST",
      body: JSON.stringify(getAll.result),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        const transaction = db.transaction(["budgetStore"], "readwrite");
        const store = transaction.objectStore("budgetStore");
        store.clear();
      });
  }
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Uh oh! " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["budgetStore"], "readwrite");
  const store = transaction.objectStore("budgetStore");
  store.add(record);
}

//event listener for coming back online
window.addEventListener("online", checkDatabase);
