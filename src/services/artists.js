import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get, Post, Put } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const AddArtist = async (json) => {
  return await sendRequest(() => Post(ApiActions.Artist, json));
};

export const GetArtists = async () => {
  return await sendRequest(() => Get(ApiActions.Artist, null));
};

export const EditArtist = async (json) => {
  return await sendRequest(() => Put(ApiActions.Artist, json));
};

export const RemoveArtists = async (json) => {
  return await sendRequest(() => Delete(ApiActions.Artist, json));
};
