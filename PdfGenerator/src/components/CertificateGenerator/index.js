import {BaseButton, styles} from "../../../BaseButton";
import {defaultApiHeaders} from "../../../../Shared/constants";

const CertificateGenerator = (props) => {
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
    return<BaseButton style={styles.button} {...props.button}></BaseButton>;
};

export default CertificateGenerator;
