import React from 'react'

import '../Shared/icons'
import {BaseButton} from "../../../BaseButton";

export const CertificateGenerator = (props) => {
    props.button = {
        ...props.button, generateDocument: () => {
            return 'https://www.google.com';
        }
    }
    return <BaseButton {...props.button}></BaseButton>;
};
