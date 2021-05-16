import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get, Post, Put } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";
import { arrayToQueryString } from "./shared/request-helper";

export const AddHobby = async (name) => {
  return sendRequest(() => Post(`${ApiActions.Hobby}?name=${name}`));
};

export const GetHobbies = async () => {
  return sendRequest(() => Get(ApiActions.Hobby));
};

export const EditHobbies = async (json) => {
  return sendRequest(() => Put(ApiActions.Hobby, json));
};

export const RemoveHobbies = async (data) => {
  return sendRequest(() => Delete(`${ApiActions.Hobby}${arrayToQueryString(data, "uuid-collection")}`));
};
