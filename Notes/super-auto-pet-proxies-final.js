// Final proxy attempts for super auto pets 

// Fetch
ofetch = fetch;
fetch = function (request, options) {
    // Check if the request is a roll request.
    // if so intercept it.
    // else procede as normal
    let copiedReqWithOptions = new Request(request, options);
    if (
        copiedReqWithOptions.url ==
        "https://api.teamwood.games/0.19/api/build/roll" &&
        copiedReqWithOptions.method == "POST"
    ) {
        /*Intercept request*/
        return Promise.resolve(
            new Response(
                '{"Event":{"Event":{"Free":false,"StartOfTurn":false,"Owner":1,"Number":0},"Owner":1},"Data":{"Seed":207569098,"Hash":-1863324665}}'
            )
        );
    } else {
        return ofetch(request, options);
    }
};



//XHR
let desiredResponse = (new TextEncoder).encode('{"Event":{"Event":{"Free":false,"StartOfTurn":false,"Owner":1,"Number":0},"Owner":1},"Data":{"Seed":207569098,"Hash":-1863324665}}')

XMLHttpRequest = new Proxy(XMLHttpRequest, {
    construct(target) {
        return new Proxy(new target(), {
            get(target, propname, ref) {
                console.log(`hooked get: prop: ${propname}`);
                let temp = target[propname];
                if(propname == 'response' && target.responseURL ==='https://api.teamwood.games/0.19/api/build/roll'){
                    return desiredResponse;
                }
                if (temp instanceof Function) {
                    console.log("got function");
                    temp = temp.bind(target);
                }
                return temp;
            },
            set(target, prop, val, rec) {
                console.log(`hooked set: ${prop}`);
                return Reflect.set(target, prop, val);
            },
        });
    },
});