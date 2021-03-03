import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get, Post, Put } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const addDatepicker = async (json) => {
  return await sendRequest(() => Post(ApiActions.Datepicker, json), [409]);
};

export const saveAvailability = async (json, uuid) => {
  return await sendRequest(() => Post(ApiActions.DatepickerAvailability + uuid, json));
};

export const editDatepicker = async (json) => {
  return await sendRequest(() => Put(ApiActions.Datepicker, json));
};

export const getDatepickers = async () => {
  return await sendRequest(() => Get(ApiActions.Datepicker));
};

export const getDatepicker = async (uuid) => {
  return await sendRequest(() => Get(ApiActions.Datepicker + uuid));
};

export const deleteDatepicker = async (uuid) => {
  return await sendRequest(() => Delete(ApiActions.Datepicker + uuid));
};
