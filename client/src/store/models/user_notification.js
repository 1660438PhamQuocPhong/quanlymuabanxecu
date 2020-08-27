import { Model } from "@vuex-orm/core";
import User from "./user";

export default class UserNotification extends Model {
  static entity = "userNotification";

  static fields() {
    return {
      id: this.attr(null),
      name: this.attr(null),
      receiverName: this.attr(null),
      senderName: this.attr(null),
      spaceTime: this.attr(null)
    };
  }

  static apiConfig = {

    headers: { 
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': 'Bearer ' + CookieService.get("accessToken"),
    },

    actions: {
      async fetchPaging(userId, type, page, itemPerPage = null) {
        try {
          return await this.get("/user/notification/" + userId, {
            params: {
              page: page,
              itemPerPage: itemPerPage,
              type: type
            },
            save: false,
            
          });
        } catch (error) {
          return error.response;
        }
      }
    }
  };
}
