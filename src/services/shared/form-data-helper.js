export function getFormData(formId) {
  let object = {};
  const formData = new FormData(document.getElementById(formId));
  formData.forEach((value, key) => (object[key] = value));
  return object;
}

// return true if string is null, undefined, NaN, empty, 0, false
export function stringIsNullOrEmpty(str) {
  if (str && !isBlank(str)) {
    return false;
  }
  return true;
}

function isBlank(str) {
  const chars = Array.from(str);
  return chars.every((c) => c === " ");
}

export function createGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function clearForm(formId) {
  document.getElementById(formId).reset();
}

export function disableForm(formId) {
  const form = document.getElementById(formId);
  [].slice.call(form.getElementsByTagName("input")).forEach((input) => (input.disabled = true));
  [].slice.call(form.getElementsByTagName("select")).forEach((select) => (select.disabled = true));
  [].slice.call(form.getElementsByTagName("textarea")).forEach((textarea) => (textarea.disabled = true));
  [].slice.call(form.getElementsByTagName("button")).forEach((button) => (button.disabled = true));
}

export function toggleSpinner(spinnerId, buttonId) {
  const currentState = document.getElementById(buttonId).disabled;
  document.getElementById(spinnerId).style.display = currentState ? "none" : "inline-block";
  document.getElementById(buttonId).disabled = !currentState;
}
