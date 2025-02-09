import {MenuElement, SearchInput} from "../core/elements/Type.Element";
import { DivComponent, TextComponent, ImageComponent, ButtonComponent, withEventHandlers } from "../core/components/Type.Component";
import UserManager from "../core/managers/UserManager";
import { getCookie, setCookie } from "../core/Cookie";

const FriendPage = {
  layoutVisibility: true,
  render: () => {
    const pageContainer = MenuElement("FriendPage");
    pageContainer.elements[0].class += "container text-center";
    pageContainer.elements[0].styles.overflow = "auto";
    pageContainer.elements[0].styles.maxHeight = "60vh";
    const userManager = new UserManager();
    userManager.initialize().then(async() => {
      const friendListDiv = new DivComponent("friend-list", {
        elements: [
          new TextComponent("friend-list-title", { text: "Friend List", class: "text-center element-h2" }),
        ],
      });
      const friendRequestsDiv = new DivComponent("friend-requests", {
        elements: [
          new TextComponent("friend-requests-title", { text: "Friend Requests", class: "text-center element-h2" }),
        ],
      });
      const friendBlockDiv = new DivComponent("friend-block", {
        elements: [
          new TextComponent("friend-block-title", { text: "Blocked Users", class: "text-center element-h2" }),
        ],
      });
      const usersDiv = new DivComponent("users", {
        elements: [
          new TextComponent("users-title", { text: "Users", class: "text-center element-h2" }),
        ],
      });
      const searchInput = SearchInput("Search Users", "Search");

      const friendList = await userManager.getAllFriends();
      const friendRequests = await userManager.getReceivedFriendRequests();
      const friendBlock = await userManager.getBlockedUsers()
      const users = await userManager.getAllUsers();

      for (const userId of friendList) {
        friendListDiv.elements.push(await createRow(userId.id, userManager));
      }

      for (const userId of friendRequests) {
        friendRequestsDiv.elements.push(await createRow(userId.id, userManager));
      }

      for (const userId of friendBlock) {
        friendBlockDiv.elements.push(await createRow(userId.id, userManager));
      }

      for (const userId of users) {
        usersDiv.elements.push(await createRow(userId.id, userManager));
      }

      pageContainer.update(pageContainer.elements[0].elements=[
        searchInput,
        friendListDiv,
        friendRequestsDiv,
        friendBlockDiv,
        usersDiv,
      ]);

      return pageContainer.render();
    })

    return pageContainer.render();
  }
}

export default FriendPage;


async function createRow(userId, userManager) {
  const user = await userManager.getUserById(userId);
  const userDiv = new DivComponent(`user-${userId}`);
  const userImage = new ImageComponent(`user-image-${userId}`, { src: user.avatar });
  const userName = new TextComponent(`user-name-${userId}`, { text: user.username });
  const rank = new TextComponent(`user-rank-${userId}`, { text: user.rank });
  const sendFriendRequest = new ButtonComponent(`send-friend-request-${userId}`, { label: "Send Friend Request", isRequest: false });
  const deleteFriend = new ButtonComponent(`delete-friend-${userId}`, { label: "Delete Friend" });
  const acceptFriendRequest = new ButtonComponent(`accept-friend-request-${userId}`, { label: "Accept Friend Request" });
  const blockUser = new ButtonComponent(`block-user-${userId}`, { label: "Block User" });
  const unblockUser = new ButtonComponent(`unblock-user-${userId}`, { label: "Unblock User" });

  userDiv.elements.push(userImage, userName, rank);
  if (userManager.isFriend(userId)) {
    userDiv.elements.push(deleteFriend);
    userDiv.elements.push(blockUser);
  }
  else if (userManager.isBlocked(userId)) {
    userDiv.elements.push(unblockUser);
  }
  else if (userManager.isRequestSent(userId)) {
    userDiv.elements.push(acceptFriendRequest);
  }
  else {
    userDiv.elements.push(sendFriendRequest);
    userDiv.elements.push(blockUser);
  }

  withEventHandlers(sendFriendRequest, { onClick: async() => {
    if (sendFriendRequest.isRequest)
    {
      await userManager.sendFriendRequestReject(userId);
      sendFriendRequest.update({label: "x", isRequest: false})
    }
    else
    {
      await userManager.sendFriendRequestAccept(userId);
      sendFriendRequest.update({label: "Send Friend Request", isRequest: true})
    }
  }});
  withEventHandlers(deleteFriend, { onClick: async() => {
    await userManager.deleteFriend(userId);
  }});
  withEventHandlers(acceptFriendRequest, { onClick: async() => {
    await userManager.acceptFriendRequest(userId);
  }});
  withEventHandlers(blockUser, { onClick: async() => {
    await userManager.getBlockedUserById(userId);
  }});
  withEventHandlers(unblockUser, { onClick: async() => {
    await userManager.unblockUser(userId);
  }});

  return userDiv;
}
