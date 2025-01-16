import { BaseButton } from "../../../BaseButton";
import {
  componentsIds,
  defaultApiHeaders,
  urls,
} from "../../../Shared/constants";

const ScreenGenerator = (props) => {
  const newProps = {
    ...props.button,
    _height: props._height,
    componentId: componentsIds.screenGenerator,
    generateDocument: async () => {
      
    },
  };

  <BaseButton {...newProps}></BaseButton>;
};

export default ScreenGenerator;
