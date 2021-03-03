import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get, Post, Put } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const AddHobby = async (json) => {
  return await sendRequest(() => Post(ApiActions.Hobby, json));
};

export const GetHobbies = async () => {
  return await sendRequest(() => Get(ApiActions.Hobby));
};

export const EditHobbies = async (json) => {
  return await sendRequest(() => Put(ApiActions.Hobby, json));
};

export const RemoveHobbies = async (json) => {
  return await sendRequest(() => Delete(ApiActions.Hobby, json));
};
