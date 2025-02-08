import {ImageComponent, DivComponent} from "../components/Type.Component";

const ProfilePhoto = (id, src) => {
  const photoDiv = new DivComponent(id, {class: "profilePhotoBorder"});
  const photo = new ImageComponent("profilePhoto", {src: src, alt: "Profile Photo"});
  photoDiv.elements = [photo];
  return photoDiv;
}

export default ProfilePhoto;
