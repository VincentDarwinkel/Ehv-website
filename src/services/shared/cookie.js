import Cookies from "universal-cookie";

export function setAuthorizationCookie(authorizationTokens) {
  const expirationTimeJwt = new Date();
  expirationTimeJwt.setHours(expirationTimeJwt.getMinutes() + 15);

  const expirationTimeRefresh = new Date();
  expirationTimeRefresh.setHours(expirationTimeRefresh.getMinutes() + 15);

  setCookie("jwt", authorizationTokens.jwt, expirationTimeJwt);
  setCookie("refreshToken", authorizationTokens.refreshToken, expirationTimeRefresh);
}

function setCookie(name, value, expiration) {
  const cookie = new Cookies();
  cookie.remove(name, { path: "/" });
  cookie.set(name, value, {
    path: "/",
    expires: expiration,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
}
