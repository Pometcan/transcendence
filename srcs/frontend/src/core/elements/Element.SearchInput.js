import { DivComponent, InputComponent, ButtonComponent } from "../components/Type.Component";
import { InputElement } from "./Type.Element";

const SearchInput = (searchText, searchbuttontext, buttonclick) => {
  const searchContainer = new DivComponent("searchContainer", {class: "d-flex justify-content-center"});
  const searchInput = InputElement(searchText, "User Name", "text");
  searchInput.elements.class = "d-flex justify-content-center align-items-center";
  searchInput.elements[0].styles = {
    width: "60%",
    borderRadius: "10px 0px 0px 10px !important",
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
