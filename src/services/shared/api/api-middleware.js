import Cookies from "universal-cookie";
import handleErrorMessages from "../fetch-error-messages";
import { Post } from "./Api";
import ApiActions from "services/shared/api/ApiActions";
import { setAuthorizationCookie } from "../cookie";
import paths from "../router-paths";
import { toast } from "react-toastify";

const { getClaim } = require("services/jwt");
const { default: jwtClaims } = require("../jwt-claims");

async function renewAuthorizationTokens() {
  const oldAuthorizationTokens = new Cookies()?.get("Jwt");
  const result = await Post(ApiActions.RefreshJwt, oldAuthorizationTokens.refreshToken);
  if (result.status === 401) {
    window.location.pathname = paths.Login;
    return;
  }
  if (result?.status !== 200) {
    toast.error("Fout tijdens het vernieuwen van jwt token, probeer opnieuw in te loggen");
    return;
  }

  const refreshedAutorizationTokens = await result.json();
  setAuthorizationCookie(refreshedAutorizationTokens);
}

export async function sendRequest(requestFunction, ignoredStatusCodes) {
  const jwtExpirationDateTime = getClaim(jwtClaims.expires);
  const currentDateTime = Math.round(new Date().getTime() / 1000);

  if (jwtExpirationDateTime - 10 < currentDateTime) {
    await renewAuthorizationTokens();
  }

  const response = await requestFunction();
  handleErrorMessages(response, ignoredStatusCodes);
  return response;
}
