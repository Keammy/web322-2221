
const doSomething = (name = "no value", age = "no value") =>
{

    if (name == "no value" && age == "no value")
    {
        // Do something here
    }

    console.log(`${name} ${age}`);
}

doSomething("Jon Snow", 40);
doSomething("Jon Snow");    
doSomething();              
doSomething(undefined, 40); 
doSomething("Jon Snow", undefined);
