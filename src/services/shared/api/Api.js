export const Get = async (action) => {
  try {
    return await fetch(action, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {},

      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  } catch (error) {
    return error;
  }
};

export const Post = async (action, data = null, contentType = "application/json") => {
  try {
    return await fetch(action, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers:
        contentType === "application/json"
          ? {
              "Content-Type": "application/json",
            }
          : {},

      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: contentType === "application/json" ? JSON.stringify(data) : data,
    });
  } catch (error) {
    return error;
  }
};

export const Put = async (action, data = null, contentType = "application/json") => {
  try {
    return await fetch(action, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers:
        contentType === "application/json"
          ? {
              "Content-Type": "application/json",
            }
          : {},

      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: contentType === "application/json" ? JSON.stringify(data) : data,
    });
  } catch (error) {
    return error;
  }
};

export const Delete = async (action, data = null) => {
  try {
    return await fetch(action, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },

      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: data,
    });
  } catch (error) {
    return error;
  }
};
