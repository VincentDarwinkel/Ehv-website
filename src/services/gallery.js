import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get, Post } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const GetDirectoryInfo = (path) => {
  return sendRequest(() => Get(`${ApiActions.FileApiDirectory}?path=${path}`), [404, 422]);
};

export const GetFile = (uuid) => {
  return sendRequest(() => Get(`${ApiActions.FileApiFiles}/${uuid}`));
};

export const CreateFolder = (path) => {
  return sendRequest(() => Post(`${ApiActions.FileApiDirectory}?path=${path}`));
};

export const RemoveDirectory = (path) => {
  return sendRequest(() => Delete(`${ApiActions.FileApiDirectory}/${path}`));
};

export const RemoveFile = (uuid) => {
  return sendRequest(() => Delete(`${ApiActions.FileApiFiles}/${uuid}`));
};
