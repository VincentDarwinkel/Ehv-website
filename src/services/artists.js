import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get, Post, Put } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";
import { arrayToQueryString } from "./shared/request-helper";

export const AddArtist = async (name) => {
  return sendRequest(() => Post(`${ApiActions.Artist}?name=${name}`));
};

export const GetArtists = async () => {
  return sendRequest(() => Get(ApiActions.Artist, null));
};

export const EditArtist = async (json) => {
  return sendRequest(() => Put(ApiActions.Artist, json));
};

export const RemoveArtists = async (data) => {
  return sendRequest(() => Delete(`${ApiActions.Artist}${arrayToQueryString(data, "uuid-collection")}`));
};
