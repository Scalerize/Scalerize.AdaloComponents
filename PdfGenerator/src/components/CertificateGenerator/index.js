import {BaseButton} from "../../../BaseButton";
import {componentsIds, defaultApiHeaders} from "../../../../Shared/constants";

const CertificateGenerator = (props) => {
    const newProps = {
        ...props.button,
        componentId: componentsIds.certificateGenerator,
        _height: props._height,
        generateDocument: async () => {
            var apiProps = {
                ...props,
                border: props.certificateBorder
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
