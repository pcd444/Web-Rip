Breif descriptions of what you are currently thinking about.
When any of these ideas is well formed and somewhat complete promote it to the latest log file.


+ How to proxy fetch?
    - Issue 1: copying Request/Response without ruining them.
    - Issue 2: Proxying promises. Just need the first then/catch.
        let ofetch = fetch;
        fetch = function(resource, init){

            console.log('Fetch args->',...arguments);
            // Below it the core
            return ofetch(...arguments).then(a=>{console.log('suc->'+a); return a;},a=>{console.log('fail->'+a);throw a;});
        } 

+ How to copy request?
    - request.clone(), or maybe the request constructor.
    - Whats the difference between request.clone and request constructor?
    - but we want to copy data in a way that can leave the browser.
+ How to copy string?
    - =
+ How to copy stringifyable? 
    - toString (i belive)

+ What happens when there are conflicts between fetch options and request options? Or is there a way 
  to copy a request so that these conflicts dont matter?
  - The fetch spec says that fetch internally makes a new request ```new Request(fetchArg1, fetchArg2);```. 
    This means that the options would override the request options. What we should do is make our own copy and use that as
    the key to the fetch map.
  - There are fetch options that aren't request options. These are keepalive and signal.


+ How to deal with abort signals in fetch?


