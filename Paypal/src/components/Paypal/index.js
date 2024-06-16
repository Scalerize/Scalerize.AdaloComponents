import {WebView} from 'react-native-webview';

const componentId = 2;
const paypalUrl = 'https://paypal-scalerize.flutterflow.app/';

const Paypal = ({
                    editor,
                    backgroundColor,
                    foregroundColor,
                    onFinished,
                    amount,
                    currency,
                    clientId,
                    clientSecret,
                    isSandbox,
                    language
                }) => {
    return <WebView
        source={{uri: paypalUrl}}
        onNavigationStateChange={(webViewState) => {
            if (webViewState.url.startsWith(paypalUrl + 'success')) {
                onFinished(true);
            } else if (webViewState.url.startsWith(paypalUrl + 'error')) {
                onFinished(false);
            }
        }}
    />;
};

export default Paypal;
