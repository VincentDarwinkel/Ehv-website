import Cookies from "universal-cookie";

export function setAuthorizationCookie(authorizationTokes) {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 24);

  const cookie = new Cookies();
  cookie.remove("Jwt", { path: "/" });
  cookie.set("Jwt", authorizationTokes, {
    path: "/",
    expires: expirationDate,
    sameSite: true,
  });
}
