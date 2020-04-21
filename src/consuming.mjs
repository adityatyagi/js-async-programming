import setText, { appendText, showWaiting, hideWaiting } from "./results.mjs";

export function get() {
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            setText(JSON.stringify(data));
        });
}

export function getCatch() {
    axios.get("http://localhost:3000/orders/123")
        .then(({ data }) => {
            setText(JSON.stringify(data));
        }).catch((error) => {
            setText(error);
        });
}

export function chain() {
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        }).then(({ data }) => {
            setText(`City: ${data.city}`);
        });
}

export function chainCatch() {
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        })
        // .catch(err => {
        //     // this will catch error from the 1st block only
        //     // used for fine-grained control
        //     setText('Error from first block');
        //     throw new Error("Catch in last catch block");
        // })
        .then(({ data }) => {
            setText(`City: ${data.city}`);
        })
        .catch(err => {
            // this will catch errors from all the blocks above
            setText(err);
        });
}

export function final() {
    // start loader
    showWaiting();

    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        })
        .then(({ data }) => {
            setText(`City: ${data.city}`);
        })
        .catch(err => {
            setText(err);
        }).finally(() => {
            setTimeout(() => {
                hideWaiting();
            }, 1500);

            appendText(" -- COMPLETED");
        });
}