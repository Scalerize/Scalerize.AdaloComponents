import {BaseButton} from "../../../BaseButton";
import {defaultApiHeaders} from "../../../../Shared/constants";

const CertificateGenerator = (props) => {
    console.log(props);
    props.button = {
        ...props.button,
        _height: props._height,
        generateDocument: async () => {
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

export default CertificateGenerator;
