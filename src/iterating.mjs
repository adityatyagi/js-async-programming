import setText, { appendText } from './results.mjs';

export async function get() {
    const { data } = await axios.get("http://localhost:3000/orders/1");
    setText(JSON.stringify(data));
}

export async function getCatch() {

    try {
        const { data } = await axios.get("http://localhost:3000/orders/123");
        setText(JSON.stringify(data));
    } catch (error) {
        setText(error);
    }

}

export async function chain() {
    try {
        const { data } = await axios.get("http://localhost:3000/orders/1");
        const { data: address } = await axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        setText(address.city);
    } catch (error) {
        setText(error);
    }
}

export async function concurrent() {

    try {
        // by not prefixing "await" before axios calls, we allowed them to kick-off at the same time.
        // this is because Promises are eager. We dont have to call them to make them run
        // this makes the two calls concurrent
        const orderStatus = axios.get("http://localhost:3000/orderStatuses");
        const orders = axios.get("http://localhost:3000/orders");

        setText("");

        // even though we are awaiting on the orderStatus API (slower API), the orders API is already hit and it resolved the data
        // this helped us to get the data from the faster API (orders) even though we were waiting on the slower one
        const { data: statuses } = await orderStatus;
        const { data: order } = await orders;

        appendText(JSON.stringify(statuses));
        appendText('----------------------');
        appendText(JSON.stringify(order[0]));
    } catch (error) {
        setText(error);
    }

}

export async function parallel() {
    // we'll be using the data as soon as it is available from the fastest API getting resolved

    setText("");

    await Promise.all([
        (async () => {
            const { data } = await axios.get("http://localhost:3000/orderStatuses");
            appendText('**************' + JSON.stringify(data));
        })(),
        (async () => {
            const { data } = await axios.get("http://localhost:3000/orders");
            appendText('---------------------' + JSON.stringify(data));
        })()
    ]);

}