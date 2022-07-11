/*
 * Both Date and XMLhttprequest objects have issues with naive proxying.
 * This file goes over the ways they fail and how to get around it. 
 */

// Example 1: failed proxy.
// first xmlhttprequest
{
    let x = new XMLHttpRequest();
    let px = new Proxy(x,{});
    px.open('GET','a'); // Uncaught TypeError: Illegal invocation

    // now Date
    let d = new Date();
    let pd = new Proxy(d,{});
    pd.getDate(); // Uncaught TypeError: this is not a Date object.
}

/* What is happening?
 * For Dates what is happening is an issue with internal slots.
 * Internal slots are basically object properties that are not JS 
 * accessable. The issue now is that the .getDate method, which is 
 * written in native code, tries to access a specific internal slot 
 * that isn't there. The slot isn't there because when you call a 
 * method from a proxy the this value inside the method is the proxy
 * not the object. Native code and internal slots also work off of 
 * the this value.
 * This article is a good description: 
 * https://2ality.com/2016/11/proxying-builtins.html
 * 
 * As for XMLhttpRequest it is hard to investigate. This is because
 * the XMLhttpRequest is not written in the style of the ECMAscript
 * spec and doesn't mention things like internal slots.
*/

// Why does XMLHttprequest fail/notfail below????
{
    let x = new Proxy(new XMLHttpRequest(),{});
    x.status; // Uncaught TypeError: Illegal invocation
    x.open;
    x.open('GET','a'); // Uncaught TypeError: Illegal invocation


    let y = new Proxy(new XMLHttpRequest(), {
        get(a,b,c){
            return Reflect.get(a,b,a);
        }
    });
    y.status;
    y.open;
    y.open('GET', 'a'); // Uncaught TypeError: Illegal invocation


    let z = new Proxy(new XMLHttpRequest(), {
        get(a,b,c){
            return Reflect.get(a,b,c);
        }
    });
    z.status; // Uncaught TypeError: Illegal invocation
    z.open;
    z.open('GET','a'); // Uncaught TypeError: Illegal invocation
}
// ANSWER? I think it has to do with status being a getter.

// The only way to fix it for Date.
/*
 * The only way to fix this behavior of proxies for Date objects is 
 * to replace gotten methods with one bound to the target. This sadly
 * disables the feature of a proxy being able to intercept gets and
 * sets that happen in a method becuase the this inside the method is
 * no longer the proxy but instead the target. But this isn't a big 
 * problem for Date at least. 
*/