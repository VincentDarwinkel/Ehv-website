import { Post } from "services/shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";
import actions from "./shared/api/ApiActions";

export const uploadFiles = async (formData) => {
  return sendRequest(() => Post(actions.FileApiFiles, formData, ""));
};
