import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { resetRouter, router } from "@/router";
import { storageSession } from "@pureadmin/utils";
import {
  getLogin,
  refreshTokenApi,
  RefreshTokenResult,
  UserResult
} from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, removeToken, sessionKey, setToken } from "@/utils/auth";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username:
      storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? "",
    // 页面级别权限
    roles: storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? []
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(userResult => {
            if (userResult) {
              const dataInfo: DataInfo<number> = {
                username: userResult.user.username,
                roles: userResult.user.roles.map(role => role.name),
                accessToken: userResult.accessToken,
                expires: userResult.expires
              };
              setToken(dataInfo);
              resolve(userResult);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(oldToken) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi({ oldToken: oldToken })
          .then(refreshTokenRes => {
            if (refreshTokenRes) {
              const dataInfo: DataInfo<number> = {
                username: useUserStore().username,
                roles: useUserStore().roles,
                accessToken: refreshTokenRes.accessToken,
                expires: refreshTokenRes.expires
              };
              setToken(dataInfo);
              resolve(refreshTokenRes);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
