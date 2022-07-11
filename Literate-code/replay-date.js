// We need to make it seem like the document was opened back when the recording happened.
// That means we need to change the behavior of 
//1. Date constructor, Date function (the constructor but not using new), and Date.now()

// I belive there are no obsticles to useing a proxy.

// ALERT: none of this code has been tested


const originalUnixTimeStamp = 1234 /*The ripped timestamp*/;
const actualStartTime = Date.now();
Date = new Proxy(Date,
    {
        apply(target, thisArg, argArray) {
            const fakeCurrentTimestamp = (target.now() - actualStartTime) + originalUnixTimeStamp;
            const fakeCurrentTimeObject = new target(fakeCurrentTimestamp);
            return fakeCurrentTimeObject.toString();
        },
        construct(target, argArray, newTarget) {
            if (argArray.length === 0) {
                const fakeCurrentTimestamp = (target.now() - actualStartTime) + originalUnixTimeStamp;
                return Reflect.construct(target, [fakeCurrentTimestamp], newTarget);
            } else {
                return Reflect.construct(...arguments);
            }
        },
        get(target, propertyKey, receiver) {
            if (propertyKey === "now") {
                return () => (target.now() - actualStartTime) + originalUnixTimeStamp;
            } else {
                return Reflect.get(...arguments);
            }
        }
    }
);

// Calculate time elapsed macro.
(target.now() - actualStartTime);

// Fake current Unix time stamp macro
(target.now() - actualStartTime) + originalUnixTimeStamp
