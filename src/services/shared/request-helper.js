export function arrayToQueryString(array, parameterName) {
  return array
    ?.map((item, index) => {
      const char = index === 0 ? "?" : "&";
      return `${char}${parameterName}=${item}`;
    })
    .join("");
}
