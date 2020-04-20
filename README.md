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


