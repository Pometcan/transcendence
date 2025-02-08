import { DivComponent, InputComponent, ButtonComponent, withEventHandlers } from "../components/Type.Component";
import { InputElement } from "./Type.Element";

const SearchInput = (searchText, searchbuttontext) => {
  const searchContainer = new DivComponent("searchContainer", {class: "d-flex justify-content-center"});
  const searchInput = InputElement(searchText, "User Name", "text");
  searchInput.elements[0].styles = {
    width: "60%",
    marginRight: "10px",
  };
  searchInput.elements.styles = {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  };
  const searchButton = new ButtonComponent(searchbuttontext, {
    label: "Search",
    class: "btn btn-primary",
    styles: {
      height: "100%",
    },
    type: "submit",
  });
  searchInput.elements[2] = searchButton;
  searchContainer.elements = [searchInput];


  return searchContainer;
}

export default SearchInput;
