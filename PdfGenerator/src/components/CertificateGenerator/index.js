import React from 'react'
import '../Shared/icons'
import {BaseButton} from "../../../BaseButton";
import {defaultApiHeaders} from "../../../../Shared/constants";

export const CertificateGenerator = (props) => {
    props.button = {
        ...props.button, generateDocument: async () => {
            const response = await fetch(`${urls.basePdfUrl}certificate`, {
                method: 'POST',
                headers: defaultApiHeaders,
                body: JSON.stringify(props),
            });

            const json = await response.json();
            return json.url;
        }
    }
    return <BaseButton {...props.button}></BaseButton>;
};
