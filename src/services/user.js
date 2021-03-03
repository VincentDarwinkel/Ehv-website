import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get, Post } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const LoginUser = async (json) => {
  return await sendRequest(() => Post(ApiActions.Login, json), [401]);
};

export const GetAllUsers = async () => {
  return await sendRequest(() => Get(ApiActions.AllUsers));
};

export const GetUsersByUuid = async (json) => {
  return await sendRequest(() => Post(ApiActions.UsersByUuid, json));
};

export const RegisterUser = async (json) => {
  return await sendRequest(() => Post(ApiActions.User, json));
};

export const RemoveUser = async (uuid) => {
  return await sendRequest(() => Delete(ApiActions.User + uuid));
};
