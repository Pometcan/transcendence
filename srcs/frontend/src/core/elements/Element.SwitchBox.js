import { DivComponent, CheckboxComponent, LabelComponent } from "../components/Type.Component";

const SwitchBox = (id, text) => {
  const group = new DivComponent(id, {
    class: "form-check form-switch",
  });
  const checkbox = new CheckboxComponent(`${id}Checkbox`, {
    object: { role: "switch", type: "checkbox", id: `${id}Checkbox`,class: "form-check-input", },
  });
  const label = new LabelComponent(`${id}Label`, {
    text,
    object: { for: `${id}Checkbox`,class: "form-check-label", },
  });

  group.elements = [
    checkbox,
    label,
  ]

  return group;
}

export default SwitchBox;
