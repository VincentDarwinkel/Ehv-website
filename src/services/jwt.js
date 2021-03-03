import Cookies from "universal-cookie";

export function getClaim(claim) {
  const cookie = new Cookies();
  const token = cookie.get("Jwt")?.jwt;
  if (token === undefined) {
    return undefined;
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );

  const jwt = JSON.parse(jsonPayload);
  return jwt[claim];
}
