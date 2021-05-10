import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const GetFileNamesFromDirectory = async (path) => {
  return await sendRequest(() => Get(`${ApiActions.FileApiDirectory}?path=${path}`));
};

export const GetDirectoryInfo = async (path) => {
  return await sendRequest(() => Get(`${ApiActions.FileApiDirectoryInfo}?path=${path}`), [404, 422]);
};

export const GetFile = async (uuid) => {
  return await sendRequest(() => Get(`${ApiActions.FileApiFiles}?uuid=${uuid}`));
};

export const RemoveDirectory = async (path) => {
  return await sendRequest(() => Delete(`${ApiActions.FileApiDirectory}?path=${path}`));
};

export const RemoveFile = async (uuid) => {
  return await sendRequest(() => Delete(`${ApiActions.FileApiFiles}?uuid=${uuid}`));
};
