import {WebView} from 'react-native-webview';

const componentId = 2;
const paypalUrl = 'https://paypal-scalerize.flutterflow.app/';

const Paypal = ({
                    editor,
                    paymentPage,
                    amount,
                    currency,
                    description,
                    button,
                    clientId,
                    clientSecret,
                    isSandbox,
                    onSuccess,
                    onCancel,
                    itemName
                }) => {
    return <WebView
        source={{uri: paypalUrl}}
        onNavigationStateChange={(webViewState) => {
            if (webViewState.url.startsWith(paypalUrl + 'success')) {
                onSuccess();
            } else if (webViewState.url.startsWith(paypalUrl + 'error')) {
                onCancel();
            }
        }}
    />;
};

export default Paypal;
