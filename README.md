# js-async-programming
Study notes on Async Programming in Javascript using promises, async-await  

# UNDERSTANDING PROMISES

Race conditions and Callback hell are fairly common in async programming.  

## CALLBACK PYRAMID OF DOOM
A common problem that arises when a program uses many levels of nested indentation to control access to a function.  

![image](https://user-images.githubusercontent.com/18363595/79784643-2f301200-8360-11ea-861d-7fee74532e6d.png)  

This is doom because:  
1. Dirty Code  
2. Handling Errors  

## SOLVING CALLBACK PYRAMID OF HELL - PROMISES  
`Promise`: Object that represents the **eventual completion** (or failure) of an async operation, and its resulting value.  

It also makes the code more readable.  

## PROMISE STATES  
It can have 3 states:

1. **Pending**: The inital state. When you first create a `Promise`, it is in Pending state.  In an API call, when the API is happening, the Promise is in pending state.  

2. **Fulfilled**: When the async call has completed successfully. When it is fulfilled, it returns a SINGLE VALUE. When a promise has fulfilled, we say it is `Resolved` or `Settled`.  

3. **Rejected**: When the async call has failed. It moves from Pending -> Rejected when the API call fails. It returns a reason why it was rejected, similarly to the catch block. This is when the promised is `Rejected`  

Promises are NOT LAZY. They are eagerly evaluated. Promises do not wait for us to request the value before they execute!

# CONSUMING PROMISES

Promises return promises. Be it then() or catch(), they both return Promises.  
You can use this feature to chain Promises.  

### MORE CONTROL OVER CATCHING ERRORS

```javascript
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);


        })
        .catch(err => {
            // this will catch error from the 1st block only
            // used for fine-grained control
            setText('Error from first block');
            throw new Error("Catch in last catch block");
        })
        .then(({ data }) => {
            setText(`City: ${data.my.city}`);
        })
        .catch(err => {
            // this will catch errors from all the blocks above
            setText(err);
        });
}
```  

If you do decide to catch at multiple times, make sure you do it thoroughly.  

### PERFORMING ONE LAST OPERATION - FINALLY()
This is a use case where you dont care if the promise gets fulfilled or rejected, you just want this particular piece of code to be executed.  
For example, a loading indicator.  

This is also useful when one of your `then` block has a long piece of code with multiple async operations which will take time to complete. You dont want to stop the loader as soon as the promise is resolved, you want to stop the loader when the entire `then` finishes.  

You can accomplish this using the `finally()` block of code after the `catch()`.  

# CREATING AND QUEUING PROMISES

