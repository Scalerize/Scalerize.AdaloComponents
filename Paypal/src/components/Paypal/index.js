import WebView from 'react-native-webview';

const paypalUrl = 'https://paypal-scalerize.flutterflow.app/';

const Paypal = (props) => {

    console.log(props);

    const buildQueryString = (props) => {
        let queryString = '';
        Object.keys(props).forEach(key => {
            if (typeof props[key] === 'object' && props[key] != null) {
                Object.keys(props[key]).forEach(nestedKey => {
                    if (props[key][nestedKey] !== undefined) {
                        let combinedKey = key + nestedKey.charAt(0).toUpperCase() + nestedKey.slice(1);
                        queryString += `${encodeURIComponent(combinedKey)}=${encodeURIComponent(props[key][nestedKey])}&`;
                    }
                });
            } else if (props[key] != null) {
                queryString += `${encodeURIComponent(key)}=${encodeURIComponent(props[key])}&`;
            }
        });
        return queryString.slice(0, -1);
    };

    let uri = paypalUrl + '?' + buildQueryString(props);

    return <WebView
        source={{uri}}
        onNavigationStateChange={(webViewState) => {
            if (webViewState.url.startsWith(paypalUrl + 'success')) {
                const urlParams = new URLSearchParams(webViewState.url);
                const paymentId = urlParams.get('paymentId');
                props.onSuccess(paymentId);
            } else if (webViewState.url.startsWith(paypalUrl + 'error')) {
                props.onCancel();
            }
        }}/>;
};

export default Paypal;
