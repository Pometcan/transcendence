import { ButtonComponent } from "../components/UIComponent.Button";

const SubmitButton = (id, text) => {
  return new ButtonComponent(id, {
    class: "btn mt-3",
    styles: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      background: "rgba(0, 185, 255, 0.6)",
      border: "none",
      color: "#fff",
      fontFamily: "Orbitron",
      fontSize: "18px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
      hover: {
        background: "rgba(0, 185, 255, 1)",
      },
    },
    label: text,
  });
}

export default SubmitButton;
