import ApiActions from "services/shared/api/ApiActions";
import { Get, Delete, Post } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const GetAllEvents = async () => {
  return sendRequest(() => Get(ApiActions.AllEvents));
};

export const GetEventByUuid = async (uuid) => {
  return sendRequest(() => Get(ApiActions.Event + uuid));
};

export const SaveEventStepProgress = async (uuid, completed) => {
  if (completed) {
    return sendRequest(() => Post(ApiActions.EventStepUser + uuid));
  } else {
    return sendRequest(() => Delete(ApiActions.EventStepUser + uuid));
  }
};

export const ConvertDatepickerToEvent = async (json) => {
  return sendRequest(() => Post(ApiActions.ConvertDatepickerToEvent, json));
};

export const UnsubscribeFromEventDate = async (uuid) => {
  return sendRequest(() => Delete(ApiActions.EventDateUser + uuid));
};

export const CancelEvent = async (uuid) => {
  return sendRequest(() => Delete(ApiActions.Event + uuid));
};
