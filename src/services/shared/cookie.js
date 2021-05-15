import Cookies from "universal-cookie";

export function setAuthorizationCookie(authorizationTokens) {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24);

  const cookie = new Cookies();
  cookie.remove("Jwt", { path: "/" });
  cookie.set("Jwt", authorizationTokens, {
    path: "/",
    expires: expirationDate,
    sameSite: true,
  });
}
