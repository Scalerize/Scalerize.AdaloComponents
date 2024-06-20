import WebView from 'react-native-webview';
import {Platform} from 'react-native';
import {useRef, useEffect, memo} from "react";
import {v4 as uuidv4} from 'uuid';
import {HubConnectionBuilder, HttpTransportType} from '@microsoft/signalr';
import {log} from "../../../../Shared/utils";

const paypalUrl = 'https://paypal-scalerize.flutterflow.app/';

const Paypal = memo((props) => {
    if (props.editor === undefined) {
        props.editor = false;
    }
    props.operationId = uuidv4();

    let isWeb = Platform.OS === 'web';

    if (!props.editor) {
        useEffect(() => {
            let connection = new HubConnectionBuilder()
                .withUrl("https://www.scalerize.fr/client-hubs/adalo/paypal/payment", {
                    skipNegotiation: true,
                    transport: HttpTransportType.WebSockets
                })
                .withAutomaticReconnect()
                .build();

            connection.on('SendPaymentUpdate', (state, payerId, paymentId) => {
                if (state === 'Success') {
                    !!props.onSuccess && props.onSuccess(paymentId);
                } else {
                    !!props.onCancel && props.onCancel();
                }
            });
            connection.start().then(() => {
                connection.invoke("ListenNewPayment", props.operationId, false)
                    .catch(err => log(err));
            })

            return () => {
                connection.stop();
            }
        });
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
                            queryString += `${encodeURIComponent(combinedKey)}=${encodeURIComponent(props[key][nestedKey])}&`;
                        }
                    });
                } else if (props[key] != null) {
                    queryString += `${encodeURIComponent(key)}=${encodeURIComponent(props[key])}&`;
                }
            });
        return queryString.slice(0, -1);
    };

    let uri = paypalUrl + 'pay?' + buildQueryString(props);
    let height = props.editor ? '100%' : props._height;

    return isWeb
        ? <iframe
            style={{width: '100%', height: height, borderWidth: 0}}
            src={uri}></iframe>
        : <WebView
            style={{width: '100%', height: height}}
            source={{uri}}/>;

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
