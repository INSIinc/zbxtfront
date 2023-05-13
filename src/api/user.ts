import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export type User = {
  id: string;
  username: string;
  roles: Role[];
  subUsers: User[];
  dutyStatus: number;
};
export type Role = {
  id: string;
  name: string;
  description: string;
};
export type UserResult = {
  user: User;
  /** `token` */
  accessToken: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: number;
};
export type RegisterReq = {
  username: string;
  password: string;
};
export type RegisterResult = {
  success: boolean;
  data: {
    message: string;
  };
};
export type RefreshTokenResult = {
  /** `token` */
  accessToken: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: number;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("/user/login"), { data });
};
export const registerUser = (data: RegisterReq) => {
  return http.post<RegisterReq, RegisterResult>(baseUrlApi("/register"), {
    data
  });
};
/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", baseUrlApi(`/refresh`), {
    data
  });
};
