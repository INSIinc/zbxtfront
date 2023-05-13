import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

type Result = Array<any>;

export const getAsyncRoutes = () => {
  return http.request<Result>("get", baseUrlApi("/getAsyncRoutes"));
};
