// Use the keyword let to create a variable 
// the keyword const to  create a constant variable 
// Both const and let does not hoist your variables to the top as like var

let number = 5;     // This creates a regular variable
const minWage = 50; // This creates a constant (i.e, the value cannot be changed after this line)

/*
    Variable Scope 

    1. Global Scope
    2. Function Scope (local variables)
    3. Block Scope(was only introduced in ES6)
*/

function square()
{
    return number * number;
}

console.log(square())


function cube()
{
    return number ** 3;
}

console.log(cube());


function test1()
{
    // Function scope (local variable)
    let value = 25;
}

function test2()
{
    // You cannot access value in this function because
    // value was declared in another variable
    return value + value;
}

function printMessage()
{
    // No block scope with var 

    for (var i = 1; i <= 5; i++)
    {
      console.log("JavaScript is super cool!!!");
    }

    // Variable i is accessed outside of the for block
    console.log(i);
}

printMessage();

function printMessage2()
{
    
    // Block Scope with let 

    for(let i = 1; i <= 5; i++)
    {
      console.log("JavaScript is super cool!!!");
    }

    // Variable i is not accessed outside of the for block
    console.log(i);
}

printMessage2();
