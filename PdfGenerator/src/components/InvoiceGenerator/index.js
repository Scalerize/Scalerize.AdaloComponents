import {BaseButton} from "../../../BaseButton";
import {defaultApiHeaders, urls} from "../../../../Shared/constants";

const InvoiceGenerator = (props) => {
    const getCompany = (company, prefix) => ({
        name: company[prefix + 'Name'],
        email: company[prefix + 'Email'],
        phone: company[prefix + 'Phone'],
        vatNumber: company[prefix + 'VatNumber'],
        address: {
            street: company[prefix + 'Street'],
            city: company[prefix + 'City'],
            country: company[prefix + 'Country'],
            zipCode: company[prefix + 'ZipCode'],
        },
    })

    const newProps = {
        ...props.button,
        _height: props._height,
        generateDocument: async () => {
            const response = await fetch(`${urls.basePdfUrl}accounting-document`, {
                method: 'POST',
                headers: defaultApiHeaders,
                body: JSON.stringify({
                    ...props,
                    company: getCompany(props.company, 'company'),
                    client: getCompany(props.client, 'client'),
                }),
            });

            const json = await response.json();
            return json.url;
        }
    }
    return <BaseButton {...newProps}></BaseButton>;
};

export default InvoiceGenerator;
