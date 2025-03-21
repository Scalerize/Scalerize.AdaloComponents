import {BaseButton} from "../../../BaseButton";
import {componentsIds, defaultApiHeaders, urls} from "../../../Shared/constants";

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
        componentId: componentsIds.invoiceGenerator,
        generateDocument: async () => {
            let apiProps = {
                type: props.type,
                id: props.id,
                company: getCompany(props.company, 'company'),
                client: getCompany(props.client, 'client'),
                products: props.products.map(x => ({
                    reference: x.reference,
                    description: x.description,
                    quantity: x.quantity == null ? 1 : x.quantity,
                    unitPrice: x.unitPrice || 0,
                    vatRate: x.vatRate || 0,
                })),
                logoUrl: props.logoUrl,
                clientId: props.clientId,
                paymentTerms: props.paymentTerms,
                bankDetails: props.bankDetails,
                bottomNotes: props.bottomNotes,
                footerNotes: props.footerNotes,
                currency: props.currency || 'USD'
            };
            const response = await fetch(`${urls.basePdfUrl}accounting-document`, {
                method: 'POST',
                headers: defaultApiHeaders,
                body: JSON.stringify(apiProps),
            });

            const json = await response.json();
            return json.url;
        }
    }
    return <BaseButton {...newProps}></BaseButton>;
};

export default InvoiceGenerator;
