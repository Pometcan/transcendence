import { ButtonComponent } from "../components/UIComponent.Button";

const SubmitButton = (id, text) => {
  const buttonComponent = new ButtonComponent(id, {
    class: "element-submit-button",
    label: text,
  });

  return buttonComponent;
}

export default SubmitButton;
