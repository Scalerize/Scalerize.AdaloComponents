import {beaconUrl, environment, environments} from "./constants"; 

export const log = (val) => {
    if (environment === environments.develop) {
        console.log(val)
    }
}

export const report = (values) => {
    if (environment === environments.production) {
        try {
            if (navigator?.sendBeacon && typeof (navigator.sendBeacon) === 'function') {
                navigator.sendBeacon(beaconUrl, new URLSearchParams(values))
            }
        } catch {
            // Do nothing
        }
    } else {
        log(values);
    }
    // TODO: Add a fallback to fetch if needed
} 

/*
  import {log} from "../../../../Shared/utils";
    import AsyncStorage from '@react-native-async-storage/async-storage';
    useEffect(() => {
        AsyncStorage.getItem('persist:root').then(
            (value) => {
                value = value || window.localStorage.getItem('persist:root');
                return log(value);
            }
        )
    })
 */
