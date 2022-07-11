/*
* The global fetch function is a way to make network requests through javascript.
* Documentation https://developer.mozilla.org/en-US/docs/Web/API/fetch
* The fetch function is a source of outside info and needs to be mocked in order to recreate the website.
* Since fetch interfaces with server side code and data that is inaccessable it is impossible to 
* perfectly recreate. We take the approach of recording fetch requests as the user uses the site to then
* replay once the site gets replayed.
*/

/* To record fetch you need to replace the global fetch object. */

// with a function
fetch = function(){
    // Code goes here.
}

// or with a proxy function
fetch = new Proxy(fetch,{/*handlers*/});

// function seems to be good enough. there aren't any important properties to deal with

/*
* Recording the inputs:
* The arguments to fetch consist of a manditory URL string or Request object and an optional options object.
* Documentation https://developer.mozilla.org/en-US/docs/Web/API/Request
* To record the fetch behavior we need to record the inputs. A string (or toString able like URL obj) first 
* parameter is easy to copy and store. The same is for the options object (JSON stringify). The issue is with
* Request object 
* The spec says fetch internally constructs a new request object with the two parameters and then uses  
* that new Request.**
*/