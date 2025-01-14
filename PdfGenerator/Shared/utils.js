import {urls, environment, environments} from "./constants";

export const log = (val) => {
    if (environment === environments.develop) {
        console.log(val)
    }
}

export const report = (values) => {
    if (environment === environments.production) {
        let body = JSON.stringify(values);
        try {
            if (navigator?.sendBeacon && typeof (navigator.sendBeacon) === 'function') {
                navigator.sendBeacon(urls.beacon, body)
            } else if (window.fetch && typeof (window.fetch) === 'function') {
                fetch(urls.beacon, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                }).then((response) => {
                    // Ignore response
                });
            }
        } catch {
            // Do nothing
        }
    } else {
        log(values);
    }
}
