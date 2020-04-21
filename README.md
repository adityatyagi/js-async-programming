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

Finally can be used to clear things.

# CREATING AND QUEUING PROMISES

To create your own Promise, you need to understand the states of promises.  

 - A pending promise is a promise that has not yet settled. When you create a promise using the `new Promise()`, the promise you created is in Pending state.  
 - Promise takes only one argument which is called "THE EXECUTOR FUNCTION".  
 - The Executor Function takes "resolve" as a parameter.  
 - You use "resolve" to change the state of the Promise. When you want your promise to succeed, you pass the data in the `resolve()`  

## ONLY RESOLVE ONCE
This is a note for re-resolving the same promise. You cannot.  
Once a Promise has resolved or rejected, ITS DONE! You cannot resolve it again.  

In other words, If the associated promise has already been resolved, either to a value, a rejection, or another promise, this method does nothing.  

## REJECTING PROMISES
The EXECUTOR FUNCTION which the Promise takes as the only parameter takes a second parameter - `reject`.  
When you want to reject a promise, you pass your error/reason of rejection within `reject`.  

## WAITING FOR ALL PROMISES TO RESOLVE - PROMISE.all() - SEQUENTIALLY HITTING APIs

For example, if you have to hit API's sequentially and work with the result of one API with another:  

![image](https://user-images.githubusercontent.com/18363595/79899503-87cbe180-842a-11ea-87fb-e96db3a32e29.png)

The mantra is: EITHER ALL FULFILL **OR** ONE REJECTS  

You basically use `Promsie.all()`, when you want all promises to fulfill. If one rejects, you dont want to continue as all the promises are interdependent of each other.  

Also, the order in which you give promises in the Promise.all([list of promises]) array, that is the order in which they will be received by `then` and not the order in which they actually get resolved, because the order can be different everytime of their resolution.  

## WAITING FOR PROMISES TO RESOLVE - PROMISE.allSettled() - PARALLELLY HITTING APIs  

This is used when you want to hit te APIs **PARALLELLY** and you dont want to exit even if any one of the API fails.  

The response of `Promise.allSettled()` is different that the response of `Promise.all()`.  

![image](https://user-images.githubusercontent.com/18363595/79905349-bac6a300-8433-11ea-8dc7-fc46727abb07.png)

A `catch` is not required because the type of response is JSON. Even though it is not required, it is recommended to have one.  


## RACING PROMISES - Promise.race()
![image](https://user-images.githubusercontent.com/18363595/79905934-9cad7280-8434-11ea-9797-fef3fe9ceb5a.png)  

This can be used when you have copies of your API end point deployed on various servers (separated geographically) and you want to hit the closest one, ignoring the rest.  

Race stops when the first promises settles - SUCCESS or FAILURE.  
If the first API (fastest) throws error, even if the others might resolve to success, you wont get any data.  

