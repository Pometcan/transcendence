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
          new TextComponent("users-title", { text: "Users List", class: "text-center element-h2" }),
        ],
      });
      const searchInput = SearchInput("Search Users", "Search");

      const friendList = await userManager.getAllFriends();
      const friendRequests = await userManager.getReceivedFriendRequests();
      const friendBlock = await userManager.getBlockedUsers()
      const users = await userManager.getAllUsers();

      for (const user of friendList) {
        friendListDiv.elements.push(await createRow(user, userManager));
      }

      for (const user of friendRequests) {
        friendRequestsDiv.elements.push(await createRow(user, userManager));
      }

      for (const user of friendBlock) {
        console.log(user);
        friendBlockDiv.elements.push(await createRow(user, userManager));
      }

      for (const user of users) {
        usersDiv.elements.push(await createRow(user, userManager));
      }

      pageContainer.update(pageContainer.elements[0].elements=[
        searchInput,
        friendRequestsDiv,
        friendListDiv,
        usersDiv,
        friendBlockDiv,
      ]);

      return pageContainer.render();
    })

    return pageContainer.render();
  }
}

export default FriendPage;


async function createRow(userRe, userManager) {
  if (userRe === undefined) {
    return;
  }
  let user;
  if (userRe.id)
    user = await userManager.getUserById(userRe.id);
  if (userRe.blocked_user)
    user = await userManager.getBlockedUserById(userRe.blocked_user.id);
  console.log(user);

  const userDiv = new DivComponent(`user-${user}`, { class: "d-flex justify-content-center" });
  const userImage = new ImageComponent(`user-image-${user}`, { src: user.avatar  });
  userImage.styles = {
    //crop image
    overflow: "hidden",
    borderRadius: "1%",
    width: "10rem",
    opacity: "0.6",
  };
  const userName = new TextComponent(`user-name-${user}`, { text: user.username });
  const rank = new TextComponent(`user-rank-${user}`, { text: user.rank });
  const sendFriendRequest = new ButtonComponent(`send-friend-request-${user}`, { label: "Send Friend Request", isRequest: false });
  const deleteFriend = new ButtonComponent(`delete-friend-${user}`, { label: "Delete Friend" });
  const acceptFriendRequest = new ButtonComponent(`accept-friend-request-${user}`, { label: "Accept Friend Request" });
  const blockUser = new ButtonComponent(`block-user-${user}`, { label: "Block User" });
  const unblockUser = new ButtonComponent(`unblock-user-${user}`, { label: "Unblock User" });

  userDiv.elements.push(userImage, userName, rank);
  if (userManager.isFriend(user)) {
    userDiv.elements.push(deleteFriend);
    userDiv.elements.push(blockUser);
  }
  else if (userManager.isBlocked(user)) {
    userDiv.elements.push(unblockUser);
  }
  else if (userManager.isRequestSent(user)) {
    userDiv.elements.push(acceptFriendRequest);
  }
  else {
    userDiv.elements.push(sendFriendRequest);
    userDiv.elements.push(blockUser);
  }

  withEventHandlers(sendFriendRequest, { onClick: async() => {
    if (sendFriendRequest.isRequest)
    {
      await userManager.sendFriendRequestReject(user);
      sendFriendRequest.update({label: "x", isRequest: false})
    }
    else
    {
      await userManager.sendFriendRequestAccept(user);
      sendFriendRequest.update({label: "Send Friend Request", isRequest: true})
    }
  }});
  withEventHandlers(deleteFriend, { onClick: async() => {
    await userManager.deleteFriend(user);
  }});
  withEventHandlers(acceptFriendRequest, { onClick: async() => {
    await userManager.acceptFriendRequest(user);
  }});
  withEventHandlers(blockUser, { onClick: async() => {
    await userManager.getBlockedUserById(user);
  }});
  withEventHandlers(unblockUser, { onClick: async() => {
    await userManager.unblockUser(user);
  }});

  return userDiv;
}
