import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get, Post, Put } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";
import { arrayToQueryString } from "./shared/request-helper";

export const LoginUser = (json) => {
  return sendRequest(() => Post(ApiActions.Login, json), [401, 403]);
};

export const UpdateUser = (json) => {
  return sendRequest(() => Put(ApiActions.User, json), [401, 403]);
};

export const GetAllUsers = () => {
  return sendRequest(() => Get(ApiActions.AllUsers));
};

export const GetUsersByUuid = (data) => {
  return sendRequest(() => Get(`${ApiActions.UsersByUuid}${arrayToQueryString(data, "uuid-collection")}`));
};

export const RegisterUser = (json) => {
  return sendRequest(() => Post(ApiActions.User, json));
};

export const RemoveUser = (uuid) => {
  return sendRequest(() => Delete(`${ApiActions.User}?uuid=${uuid}`));
};

export const ActivateUser = (code) => {
  return sendRequest(() => Post(`${ApiActions.ActivateAccount}?code=${code}`));
};
