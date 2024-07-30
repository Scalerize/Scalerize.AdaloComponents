import {BaseButton} from "../../../BaseButton";
import {defaultApiHeaders, urls} from "../../../../Shared/constants"; 

const InvoiceGenerator = (props) => {
    console.log(props);
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
        ...props.button, 
        _height: props._height,
        generateDocument: async () => {
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
    return <BaseButton {...props.button}></BaseButton>;
};

export default InvoiceGenerator;
