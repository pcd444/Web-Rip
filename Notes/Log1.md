****************************************************************************************************************
You can proxy addeventlistener.
****************************************************************************************************************
You can proxy element creation.
****************************************************************************************************************
Besides JS we need
    - We need the static html.
    - We need the full dom at some state.
    - We need the full css.
    - We need images/ vid/ fonts etc. 
%%%Needs fleshing out%%%( We need the full dom at some state???)
****************************************************************************************************************
You can stop the page during browser startup by putting a breakpoint in the first run piece of js
and yes you can proxy important builtins!!!!!!
!!!IMPORTANT!!!
****************************************************************************************************************
You can find the code location in js. By using. Error('').stack
****************************************************************************************************************
This ripper attempt to deal with web requests in a way that preserves some functionality of the site.
And it will do this in an interactive way that uses user knowledge.
****************************************************************************************************************
Ripping should store requests in a map. The keys would be the request, and the values would be the 
response data.
****************************************************************************************************************
How to extract the source html? You can litteraly just use fetch for the url and get the html.
The same is true for source js and css. 
****************************************************************************************************************
Other things you may have to proxy. Event source. Websocket. Date.
****************************************************************************************************************
Service workers provide a great way of intercepting network requests. You can intercept fetch, 
xmlhttprequest, image download etc. The issue is that there might already be a service worker 
for the site and there can only be one service worker for the site. If you want a service worker 
approach to always work you might have to edit the service worker code on download programatically
(don't know if possible), or add a breakpoint into the service worker code.
****************************************************************************************************************
URLs in static html cannot be intercepted the way the urls in JS can be. Thus 
they have to be transformed in the new static html. The issue with this is that 
those src and href attributes are accessable to JS and so the site won't be 100% 
the same. Even if logic using src and href attributes is probably rare and bad practice.
If you had to fix you would need to probably proxy all of the dom js objects in order to 
lie. You would mark all source html elements with some data property and proxy all of the
document.getElementBy... to make them lie when the element is a source element. 
But this is alot of work, I say skip for now. 
****************************************************************************************************************
Service worker pages are an issue. Ignore for now.
****************************************************************************************************************
The best way to download the ripped site is to use the zip library we found jszip to build up a 
virtual folder and then zip it. jszip can accomidate text and blobs so I think it will do the job.
****************************************************************************************************************
Replay the site. I belive since local files in the same folder as the html file are counted as 
cross origin it is hard or very hacky to get the site to work without a local server. If you needed
to get it to work without a local server you could have the javascript be inlined and include all 
of the img data etc. We have to consider maybe replaying using a server rather than local JS.
****************************************************************************************************************
An issue with the map method of storing server side fetches is that the same request can result in
different responses. Just think about a request to latest-videos api, sucsessive calls would have 
different responses. There are many different types of api endpoints that don't have map like behavior.
For example you could have one that depends on randomly generated numbers, one that changes based on 
a data source that the user has nothing to do with (like the latest-videos example), one that 
changes based on other api calls made by the user. Pretty obviously it isn't possible to fully 
recreate the behavior of the backend. But what we can do is warn the user of this behavior and maybe 
give options on how to attempt to simulate the behavior. For example you could try and give only the 
last response, or give the responses in the order that they were given.
****************************************************************************************************************
Fortunately the above problem of complex changing responses to API calls is uncommon because rest 
apis are supposed to be stateless (that is, there is no communication state).
****************************************************************************************************************
The problem of proxying time. 
Time (ie the date object) is another way outside state gets put into the page. it has some unique 
problems. If it is used as input into a request it makes the request very granular and hard to 
properly cache in the ripping phase. But you can't just store it and set it the way you can with 
things like local storage. The date object has other uses like timing things that you would mess 
up if you made it static. So I think you should proxy it.
****************************************************************************************************************
Technical dificulties with proxying time. Date builting objects have an issue. That issue is that 
they use internal slots. Internal slots are a part of the ECMA spec. They are internal state that
is not available to Javascript. Internal slots are also the reason that Object.freeze does not
work on date objects. Object.freeze does freeze all js properties on the date object, but the
internal slot is uneffected. That means when you call setDate or setYear those methods modify 
the internal slot, mutating it. 

The situation is less bleak for Proxying Date obj. The date proxy with an empty handler object
does break. This is because internal slots are accessed on the object directly, and don't go through
the handler. Because the proxy object isn't really a date, although it pretends to be one, when the
js engine looks for the slot it can't find it and throws an error.

Bellow is a description of what happens

// JS CODE BEING RUN
dateProxy.setDate()

// Proxy sees that the get handler is missing and so then reroutes the property get to the target.
// The internal date object gets the native code setDate method.
// But a special feature of proxies ensures that the this value inside the native code setDate method
// will the the proxy, not the Date obj. The setDate method looks for the internal slot on the 
// proxy and panics when it is not found.

Ok so how can this be fixed? The solution is to have a proxy with a get method that will return abort
bound version of the method.
That is 
get(target){
    let temp = Reflect.get(...arguments);
    return typeof temp ==="function" ? temp.bind(target): temp;
}

So now is everything ok? Sadly no. Because of function.prototype.call we can not get our proxy to have 
100% the same behavior as a normal date object. That is because Date.prototype.setDate.call(dateProxy,13)
does not invoke any handler methods but does invoke the setDate method with a proxy this value. 

****************************************************************************************************************
How much of the above log actually matters? Well what this application has to do to dates is record 
the start date on rip, and then change the behavior of the date object on replay. Where the date 
constructor acts like it is back when the ripping originally happend. So what is it that needs 
modification? 
1. Date constructor
2. Date function (the constructor but not using new)
3. Date.now()
None of these are actually a date object with the problematic internal slot.

We need to be better about focusing on the actual needs of the project. 
****************************************************************************************************************
HTTP only cookies.
Unfortunately there is some data sent in fetch/xmlhttprequest requests that is not available at all 
to javascript. That data is http only cookies. THese are basically cookies that are not visable to 
js. There is no solution, at least for the breakpoint/console method. 
How much of an issue is this? It is a medium level issue. The bad part is that since these are 
invisible it will prevent us from better storing req/resp pairs. Leading to more conflicts than 
normal. The good part is that most of what http only cookies is used for is persistent login/ 
session management. Both of these have pretty simple behavior and aren't terrible to fix by hand. 
****************************************************************************************************************
I think just using Date.now for ripping the start time will work, but if it doesn't you can try to
use perfcount which tracks the time since navigation to the site.