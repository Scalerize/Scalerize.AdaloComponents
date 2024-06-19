import WebView from 'react-native-webview';
import {Platform} from 'react-native';
import {useRef, memo} from "react";

const paypalUrl = 'https://paypal-scalerize.flutterflow.app/';

const Paypal = memo((props) => {
    const onUriChange = (url) => {
        if (!url) {
            return;
        }

        if (url.startsWith(paypalUrl + 'success')) {
            const urlParams = new URLSearchParams(url);
            const paymentId = urlParams.get('paymentId');
            props.onSuccess?.(paymentId);
        } else if (url.startsWith(paypalUrl + 'error')) {
            props.onCancel?.();
        }
    };
    const getQueryStringValue = (key, value) => {
        return encodeURIComponent(key.endsWith('Color') ? value.replace('#', '0xff') : value);
    }
    const buildQueryString = (props) => {
        let queryString = '';
        Object.keys(props)
            .filter(x => !x.startsWith('_'))
            .forEach(key => {
            if (typeof props[key] === 'object' && props[key] != null) {
                Object.keys(props[key]).forEach(nestedKey => {
                    if (props[key][nestedKey] !== undefined) {
                        let combinedKey = key + nestedKey.charAt(0).toUpperCase() + nestedKey.slice(1);
                        const value = getQueryStringValue(combinedKey, props[key][nestedKey]);
                        queryString += `${encodeURIComponent(combinedKey)}=${value}&`;
                    }
                });
            } else if (props[key] != null) {
                const value = getQueryStringValue(key, props[key]);
                queryString += `${encodeURIComponent(key)}=${value}&`;
            }
        });
        return queryString.slice(0, -1);
    };

    let iframeRef = useRef(null);
    let uri = paypalUrl + '?' + buildQueryString(props);

    return Platform.OS === 'web'
        ? <iframe
            style={{width: '100%', height: '100%', borderWidth: 0}}
            src={uri}
            ref={iframeRef}
            onLoad={() => onUriChange(iframeRef?.contentWindow?.location)}></iframe>
        : <WebView
            style={{width: '100%', height: '100%'}}
            source={{uri}}
            onNavigationStateChange={(state => onUriChange(state?.url))}/>;
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps?.button) === JSON.stringify(nextProps?.button) &&
        JSON.stringify(prevProps?.paymentPage) === JSON.stringify(nextProps?.paymentPage) &&
        prevProps?.amount === nextProps?.amount &&
        prevProps?.currency === nextProps?.currency &&
        prevProps?.clientId === nextProps?.clientId &&
        prevProps?.clientSecret === nextProps?.clientSecret &&
        prevProps?.isSandbox === nextProps?.isSandbox &&
        prevProps?.itemName === nextProps?.itemName;
});


export default Paypal;
