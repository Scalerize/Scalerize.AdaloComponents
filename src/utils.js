import {beaconUrl, environment, environments} from "./constants";

export const log = (val) => {
    if(environment === environments.develop){
        console.log(val)
    } 
}

export const report = (values) => {
 if(navigator?.sendBeacon && typeof (navigator.sendBeacon) === 'function'){
     navigator.sendBeacon(beaconUrl,
         new URLSearchParams({
             'component': 'contextual-menu',
             'missing-icon': x.icon
         }))
 } 
 // TODO: Add a fallback to fetch if needed
}
