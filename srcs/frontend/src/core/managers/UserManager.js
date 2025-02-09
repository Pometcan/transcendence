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

  isFriend(userId) {
    return this.friends && this.friends.includes(userId);
  }

  isBlocked(userId) {
    return this.blockedUsers && this.blockedUsers.includes(userId);
  }

  isRequestSent(userId) {
    return this.sentFriendRequests && this.sentFriendRequests.includes(userId);
  }

  async getAllUsers() {
    return await this._fetchApi(`/api/auth/user-list/`);
  }

  async getUserById(userId) {
    return await this._fetchApi(`/api/auth/user-list/${userId}/`);
  }

  async getAllFriends() {
    return await this._fetchApi(`/api/auth/friends/`);
  }

  async getFriendById(userId) {
    return await this._fetchApi(`/api/auth/friends/${userId}/`);
  }

  async deleteFriend(userId) {
    return await this._fetchApi(`/api/auth/friends/${userId}/`, "DELETE");
  }

  async searchUsers(username) {
    return await this._fetchApi(`/api/auth/search-user?search=${username}`);
  }

  async getSentFriendRequests() {
    return await this._fetchApi(`/api/auth/sent-friendship-request/`);
  }

  async sendFriendRequestAccept(userId) {
    return await this._fetchApi(`/api/auth/sent-friendship-request/${userId}/`, "POST", {receiver:userId, is_active: true});
  }

  async sendFriendRequestReject (userId) {
    return await this._fetchApi(`/api/auth/sent-friendship-request/${userId}/`, "POST", {receiver:userId, is_active: false});
  }

  async getReceivedFriendRequests() {
    return await this._fetchApi(`/api/auth/received-friendship-request/`);
  }

  async acceptFriendRequest(userId) {
    return await this._fetchApi(`/api/auth/received-friendship-request/${userId}/`);
  }

  async getBlockedUsers() {
    return await this._fetchApi(`/api/auth/block-users/`);
  }

  async getBlockedUserById(userId) {
    return await this._fetchApi(`/api/auth/block-users/${userId}/`);
  }

  async unblockUser(userId) {
    return await this._fetchApi(`/api/auth/block-users/${userId}/`, "DELETE");
  }
}

export default UserManager;
