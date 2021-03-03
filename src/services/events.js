import ApiActions from "services/shared/api/ApiActions";
import { Get, Delete, Post } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const GetAllEvents = async () => {
  return await sendRequest(() => Get(ApiActions.AllEvents));
};

export const GetEventByUuid = async (uuid) => {
  return await sendRequest(() => Get(ApiActions.Event + uuid));
};

export const SaveEventStepProgress = async (uuid, completed) => {
  if (completed) {
    return await sendRequest(() => Post(ApiActions.EventStepUser + uuid));
  } else {
    return await sendRequest(() => Delete(ApiActions.EventStepUser + uuid));
  }
};

export const ConvertDatepickerToEvent = async (json) => {
  return await sendRequest(() => Post(ApiActions.ConvertDatepickerToEvent, json));
};

export const UnsubscribeFromEventDate = async (uuid) => {
  return await sendRequest(() => Delete(ApiActions.EventDateUser + uuid));
};

export const CancelEvent = async (uuid) => {
  return await sendRequest(() => Delete(ApiActions.Event + uuid));
};
