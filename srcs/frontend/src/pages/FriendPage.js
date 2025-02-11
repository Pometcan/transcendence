import { MenuElement, SearchInput } from "../core/elements/Type.Element";
import { DivComponent, TextComponent, ImageComponent, ButtonComponent, withEventHandlers } from "../core/components/Type.Component";
import UserManager from "../core/managers/UserManager";
import { getCookie, setCookie } from "../core/Cookie";
import { t } from "../i42n";
const pageContainer = MenuElement("FriendPage");

const FriendPage = {
  layoutVisibility: true,
  render: () => {
    pageContainer.elements[0].class += "container text-center";
    pageContainer.elements[0].styles.overflow = "auto";
    pageContainer.elements[0].styles.maxHeight = "60vh";

    const userManager = new UserManager();

    userManager.initialize().then(async () => {
      const friendListDiv = createSection("Friend List");
      const friendRequestsDiv = createSection("Friend Requests");
      const friendBlockDiv = createSection("Blocked Users");
      const usersDiv = createSection("Users List");
      // const searchInput = SearchInput("Search Users", "Search");

      // Tüm verileri çek
      const [friendList, friendRequests, friendBlock, users] = await Promise.all([
        userManager.getAllFriends(),
        userManager.getReceivedFriendshipRequests(),
        userManager.getBlockedUsers(),
        userManager.getAllUsers()
      ]);

      // Her veri kümesi için ilgili fonksiyonu kullanarak elemanları ekle
      friendList.forEach(user => friendListDiv.elements.push(createFriendRow(user, userManager)));
      friendRequests.forEach(user => friendRequestsDiv.elements.push(createFriendRequestRow(user, userManager)));
      friendBlock.forEach(user => friendBlockDiv.elements.push(createBlockedUserRow(user, userManager)));
      users.forEach(user => usersDiv.elements.push(createUserRow(user, userManager)));

      // Sayfa içeriğini güncelle
      pageContainer.update(pageContainer.elements[0].elements = [
        friendRequestsDiv,
        friendListDiv,
        usersDiv,
        friendBlockDiv,
      ]);

      return pageContainer.render();
    });

    return pageContainer.render();
  }
};

export default FriendPage;

/**
 * ✅ Ortak Bölüm Başlığı Oluşturur
 */
function createSection(title) {
  return new DivComponent(title.toLowerCase().replace(" ", "-"), {
    elements: [new TextComponent(title.toLowerCase() + "-title", { text: title, class: "text-center element-h2" })],
  });
}

function createFriendRow(user, userManager) {
  const userDiv = createUserBaseRow(user.friend);
  const deleteFriend = new ButtonComponent(`delete-friend-${user.id}`, { label: t("friendPage.deleteFriend" });
  const blockUser = new ButtonComponent(`block-user-${user.id}`, { label: t("friendPage.block") });

  userDiv.elements.push(deleteFriend, blockUser);

  withEventHandlers(deleteFriend, { onClick: async () => {
    await userManager.deleteFriendById(user.friend.id);
    pageContainer.elements[0].update(pageContainer.elements[0])

   }});
  withEventHandlers(blockUser, { onClick: async () => await userManager.blockUserById(user.friend.id) });

  return userDiv;
}

/**
 * ✅ Gelen Arkadaşlık İstekleri için Eleman Oluşturur
 */
function createFriendRequestRow(user, userManager) {
  const userDiv = createUserBaseRow(user.sender);
  const acceptFriendRequest = new ButtonComponent(`accept-friend-request-${user.sender.id}`, { label: t("friendPage.accept") });
  const rejectFriendRequest = new ButtonComponent(`reject-friend-request-${user.sender.id}`, { label: "Reject" });

  userDiv.elements.push(acceptFriendRequest, rejectFriendRequest);

  withEventHandlers(acceptFriendRequest, { onClick: async () => await userManager.acceptReceivedFriendshipRequest(user.sender.id) });
  withEventHandlers(rejectFriendRequest, { onClick: async () => await userManager.rejectReceivedFriendshipRequest(user.sender.id) });

  return userDiv;
}

/**
 * ✅ Engellenmiş Kullanıcılar için Eleman Oluşturur
*/
function createBlockedUserRow(user, userManager) {
  const userDiv = createUserBaseRow(user.blocked_user);
  const unblockUser = new ButtonComponent(`unblock-user-${user.blocked_userid}`, { label: t("friendPage.unblock") });

  userDiv.elements.push(unblockUser);
  withEventHandlers(unblockUser, { onClick: async () => {
    await userManager.unblockUserByUserId(user.blocked_user.id);
    pageContainer.elements[0].update();

  }});

  return userDiv;
}

/**
 * ✅ Genel Kullanıcı Listesi için Eleman Oluşturur
 */
function createUserRow(user, userManager) {
  const userDiv = createUserBaseRow(user);
  const sendFriendRequest = new ButtonComponent(`send-friend-request-${user.id}`, { label: t("friendPage.sendFriend") });
  const blockUser = new ButtonComponent(`block-user-${user.id}`, { label: "Block" });

  userDiv.elements.push(sendFriendRequest, blockUser);

  withEventHandlers(sendFriendRequest, { onClick: async () => {
    await userManager.sentFriendshipRequest(user.id);
    pageContainer.elements[0].update();
  }});
  withEventHandlers(blockUser, { onClick: async () => await userManager.blockUserById(user.id) });

  return userDiv;
}

/**
 * ✅ Kullanıcı için Genel UI Oluşturur
*/
function createUserBaseRow(user) {
  const userDiv = new DivComponent(`user-${user.id}`, { class: "d-flex justify-content-center" });
  const userImage = new ImageComponent(`user-image-${user.id}`, { src: user.avatar });
  userImage.styles = {
    overflow: "hidden",
    borderRadius: "1%",
    width: "10rem",
    opacity: "0.6",
  };
  const userName = new TextComponent(`user-name-${user.id}`, { text: user.username });
  const rank = new TextComponent(`user-rank-${user.id}`, { text: user.rank });

  userDiv.elements.push(userImage, userName, rank);
  return userDiv;
}
