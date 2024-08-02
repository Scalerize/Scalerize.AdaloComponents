import {BaseButton} from "../../../BaseButton";
import {componentsIds, defaultApiHeaders, urls} from "../../../../Shared/constants";

const CertificateGenerator = (props) => {
    const newProps = {
        ...props.button,
        componentId: componentsIds.certificateGenerator,
        _height: props._height,
        generateDocument: async () => {
            var apiProps = {
                name: props.name,
                description: props.description,
                border: props.certificateBorder,
                signature: {
                    ...props.signature,
                    signatureUrl: props.signature.signatureUrl.uri
                }
            };
            const response = await fetch(`${urls.basePdfUrl}certificate`, {
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

export default CertificateGenerator;
