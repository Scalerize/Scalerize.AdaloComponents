import {beaconUrl, environment, environments} from "./constants";

export const log = (val) => {
    if (environment === environments.develop) {
        console.log(val)
    }
}

export const report = (values) => {
    if(environment === environments.production) {
        try {
            if (navigator?.sendBeacon && typeof (navigator.sendBeacon) === 'function') {
                navigator.sendBeacon(beaconUrl, new URLSearchParams(values))
            }
        } catch {
            // Do nothing
        }
    }
    else{
        log(values);
    }
    // TODO: Add a fallback to fetch if needed
}
 
