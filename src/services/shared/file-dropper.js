import { Post } from "services/shared/api/Api";
import { UploadMediaFiles } from "services/shared/api/ApiActions";
import Cookies from "universal-cookie";

const jwt = new Cookies()?.get("Jwt")?.jwt;

const jwt = cookie.get("Jwt");

export const uploadFiles = async (json) => await Post(UploadMediaFiles, jwt, json);
