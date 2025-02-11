import { getCsrfToken, getCookie } from "../Cookie";

class UserManager {
  constructor() {
    this.baseUrl = `https://${window.location.host}`;
    this.friends = null;
    this.blockedUsers = null;
    this.sentFriendRequests = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }
    try {
      await Promise.all([
        this.fetchFriends(),
        this.fetchBlockedUsers()
      ]);
      this.isInitialized = true;
    } catch (error) {
      console.error("FriendManager başlatılırken hata:", error);
    }
  }

  async _fetchApi(endpoint, method = "GET", body = null) {
    try {
      const csrfToken = await getCsrfToken();
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        "Authorization": `Bearer ${getCookie('accessToken')}`
      };

      const options = {
        method,
        credentials: "include",
        headers,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}, endpoint: ${endpoint}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(`${method} ${endpoint} Hatası:`, error);
      return null;
    }
  }

  async fetchFriends() {
    this.friends = await this._fetchApi(`/api/auth/friends/`);
    if (this.friends && Array.isArray(this.friends)) {
      this.friends = this.friends.map(friend => friend.id);
    } else {
      this.friends = [];
    }
  }

  async fetchBlockedUsers() {
    this.blockedUsers = await this._fetchApi(`/api/auth/block-users/`);
    if (this.blockedUsers && Array.isArray(this.blockedUsers)) {
      this.blockedUsers = this.blockedUsers.map(user => user.id);
    } else {
      this.blockedUsers = [];
    }
  }

  //USER
  async getAllUsers() {
    return await this._fetchApi(`/api/auth/user-list/`);
  }

  async getUserById(userId) {
    return await this._fetchApi(`/api/auth/user-list/${userId}/`);
  }

  //FRIEND
  async getAllFriends() {
    return await this._fetchApi(`/api/auth/friends/`);
  }

  async getFriendById(userId) {
    return await this._fetchApi(`/api/auth/friends/${userId}/`);
  }

  async deleteFriendById(userId) {
    return await this._fetchApi(`/api/auth/friends/${userId}/`, "DELETE");
  }

  //SEARCH-USER
  async searchUsers(username) {
    return await this._fetchApi(`/api/auth/search-user?search=${username}`);
  }

  //SENT-FRIENDSHIP-REQUEST
  async getSentFriendshipRequests() {
    return await this._fetchApi(`/api/auth/sent-friendship-request/`);
  }

  async sentFriendshipRequest(userId) {
    return await this._fetchApi(`/api/auth/sent-friendship-request/`, "POST", {receiver: userId});
  }

  async cancelSentFriendshipRequest() {
    return await this.__fetchApi(`/api/auth/sent-friendship-request/${userId}/`, "PUT", {is_active : false});
  }

  //RECEIVED-FRIENDSHIP-REQUEST
  async getReceivedFriendshipRequests() {
    return await this._fetchApi(`/api/auth/received-friendship-request/`);
  }

  async getReceivedFriendshipRequestById(requestId) {
    return await this._fetchApi(`/api/auth/received-friendship-request/${requestId}/`);
  }


  async acceptReceivedFriendshipRequest(senderId) {
    return await this._fetchApi(`/api/auth/received-friendship-request/${senderId}/`, "PUT", {is_active: false, status: 'A'});
  }

  async rejectReceivedFriendshipRequest (senderId) {
    return await this._fetchApi(`/api/auth/received-friendship-request/${senderId}/`, "PUT", {is_active: false, status: 'R'});
  }

  //BLOCK-USER
  async getBlockedUsers() {
    return await this._fetchApi(`/api/auth/block-users/`);
  }

  async blockUserById(userId) {
    return await this._fetchApi(`/api/auth/block-users/`, "POST", {blocked_user_id: userId});
  }

  async getBlockedUserById(userId) {
    return await this._fetchApi(`/api/auth/block-users/${userId}/`);
  }

  async unblockUserByUserId(userId) {
    return await this._fetchApi(`/api/auth/block-users/${userId}/`, "DELETE");
  }
  
}


export default UserManager;
