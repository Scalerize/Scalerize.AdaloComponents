import {BaseButton} from "../../../BaseButton";
import {defaultApiHeaders, urls} from "../../../../Shared/constants";
import {View} from "react-native";

const InvoiceGenerator = (props) => {
     const getCompany = (company) => ({
         ...company,
         address: {
             street: company.address.street,
             city: company.address.city,
             country: company.address.country,
             zipCode: company.address.zipCode,
         },
     })

    props.button = {
        ...props.button, generateDocument: async () => {  
           const response = await fetch(`${urls.basePdfUrl}accounting-document`, {
                method: 'POST',
                headers: defaultApiHeaders,
                body: JSON.stringify({
                    ...props,
                    company: getCompany(props.company),
                    client: getCompany(props.client),
                }),
            });

            const json = await response.json();
            return json.url;
        }
    }
    return <View {...props.button}></View>;
};

export default InvoiceGenerator;
