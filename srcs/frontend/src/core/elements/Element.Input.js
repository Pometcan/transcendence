import { InputComponent } from "../components/UIComponent.Input";
import { DivComponent } from "../components/UIComponent.Div";
import { LabelComponent } from "../components/UIComponent.Label";

const InputElement = (id, text, type) => {
  const group = new DivComponent(id, { styles: {
    position: "relative",
    marginBottom: "20px",
    width: "100%",
  } });
  const label = new LabelComponent(`${id}Label`, {
    text,
    class: "element-label",
  });
  const input = new InputComponent(`${id}Input`, {
    type: type,
    placeholder: " ",
    class: "element-input",
  });

  group.elements = [
    input,
    label
  ]

  return group;
}

export default InputElement;
