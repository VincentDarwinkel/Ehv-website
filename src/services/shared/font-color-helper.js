import { stringIsNullOrEmpty } from "./form-data-helper";

const hexToRGB = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

export default function colorIsLight(hexColor) {
  // Counting the perceptive luminance
  // human eye favors green color...
  if (stringIsNullOrEmpty(hexColor)) {
    return false;
  }

  const rgb = hexToRGB(hexColor);
  const result = 1 - (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return result < 0.5;
}
