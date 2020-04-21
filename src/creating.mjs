import setText, { appendText } from "./results.mjs";

export function timeout() {
    const wait = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Timeout!!!");
        }, 1500);
    });

    wait.then(text => setText(text));
}

export function interval() {
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => {
            console.log('SET INTERVAL');
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    });

    wait.then(text => setText(text)).finally(() => {
        appendText(`-------- ${counter}`);
    });
}

export function clearIntervalChain() {
    let counter = 0;
    let interval;
    const wait = new Promise((resolve) => {
        interval = setInterval(() => {
            console.log('SET INTERVAL');
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    });

    wait.then(text => setText(text)).finally(() => {
        appendText(`-------- ${counter}`);
        clearInterval(interval);
    });
}

export function xhr() {
    let request = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/7");

        // xhr only calls onerror when there is a network error, therefore while working with XHR, always check status

        // success
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {

                // response from server
                reject(xhr.statusText);
            }
        };

        // failure
        xhr.onerror = () => reject("Request Failed");

        // send
        xhr.send();
    });

    request.then(data => {
        setText(data);
    }).catch(error => setText(error));
}

export function allPromises() {

    // waiting for all these promises to fulfill first and then run some piece of code.
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");

    // this will produce error
    let addressType = axios.get("http://localhost:3000/addressType");

    // here we dont know the sequence in which they'll hit, but we'll wait till all 3 resolved
    Promise.all([categories, statuses, userTypes, addressType])
        .then(([cat, stat, type, addressType]) => {
            // the order of the results will match the order in which we added Promises in the Promise.all() array and not the order in which they resolve

            // this means, categories will always be the first result  
            setText("--------------");
            appendText(JSON.stringify(cat.data));
            appendText("--------------");
            appendText(JSON.stringify(stat.data));
            appendText("--------------");
            appendText(JSON.stringify(type.data));
            appendText("--------------");
            appendText(JSON.stringify(addressType.data));

        })
        .catch(err => {
            setText(err);
        });
}

export function allSettled() {
    // waiting for all these promises to fulfill first and then run some piece of code.
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");

    // this will produce error
    let addressType = axios.get("http://localhost:3000/addressType");

    // here we dont know the sequence in which they'll hit, but we'll wait till all 3 resolved
    Promise.allSettled([categories, statuses, userTypes, addressType])
        .then((values) => {
            // rather than having separate response, it is one single response.  
            let results = values.map(v => {
                if (v.status === 'fulfilled') {
                    return `FULFILLED: ${JSON.stringify(v.value.data[0])}`
                };

                return `REJECTED: ${v.reason.message}`;
            });

            setText(results);

        })
        .catch(err => {
            setText(err);
        });
}

export function race() {
    let users = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3001/users");

    Promise.race([users, backup])
        .then(users => {
            // this will return the first promise which settles
            setText(JSON.stringify(users.data));
        })
        .catch(err => setText(err));
}