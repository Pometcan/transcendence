import {MenuElement, SearchInput} from "../core/elements/Type.Element";
import { DivComponent } from "../core/components/Type.Component";
const FriendPage = {
  layoutVisibility: true,
  render: () => {
    const pageContainer = MenuElement("FriendPage");
    const searchInput = SearchInput("searchInput", "Search for a friend");
    pageContainer.elements[0].elements = [
      searchInput,
    ];
    return pageContainer.render();
  }
}

export default FriendPage;
