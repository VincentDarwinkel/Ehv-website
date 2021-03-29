import { Post } from "services/shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";
import actions from "./shared/api/ApiActions";

export const uploadFiles = async (formData, path) => {
  if (formData instanceof FormData) {
    return await sendRequest(() => Post(actions.UploadFiles + path, formData, "multipart/form-data"));
  } else {
    console.error("Instance is not type of FormData");
  }
};
