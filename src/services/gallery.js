import ApiActions from "services/shared/api/ApiActions";
import { Get } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const GetFileNamesFromDirectory = async (path) => {
  return await sendRequest(() => Get(`${ApiActions.FileApiDirectory}?path=${path}`));
};

export const GetFile = async (uuid) => {
  return await sendRequest(() => Get(`${ApiActions.FileApiFiles}/${uuid}`));
};
