import React from 'react'
import {BaseButton} from "../../../BaseButton";

export const InvoiceGenerator = (props) = (props) => {
    props.button = {
        ...props.button, generateDocument: () => {
            return 'https://www.google.com';
        }
    }
    return <BaseButton {...props.button}></BaseButton>;
};

