import {MenuElement} from "../core/elements/Type.Element";

const HomePage = {
  layoutVisibility: true,
  render:  () => {
    const pageContainer = MenuElement("FriendPage");

    return pageContainer.render();
  }
}


export default HomePage;
