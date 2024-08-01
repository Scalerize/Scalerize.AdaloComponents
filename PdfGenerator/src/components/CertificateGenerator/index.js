import {BaseButton} from "../../../BaseButton";
import {defaultApiHeaders} from "../../../../Shared/constants";

const CertificateGenerator = (props) => {
    console.log(props);
    const newProps = {
        ...props.button,
        _height: props._height,
        generateDocument: async () => {
            var apiProps = {
                ...props,
                border: props.certificateBorder
            };
            console.log(apiProps);
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
