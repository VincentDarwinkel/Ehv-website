import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get, Post, Put } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const addDatepicker = async (json) => {
  return sendRequest(() => Post(ApiActions.Datepicker, json), [409]);
};

export const saveAvailability = async (data) => {
  return sendRequest(() => Post(ApiActions.DatepickerAvailability, data));
};

export const editDatepicker = async (json) => {
  return sendRequest(() => Put(ApiActions.Datepicker, json));
};

export const getDatepickers = async () => {
  return sendRequest(() => Get(ApiActions.Datepicker));
};

export const getDatepicker = async (uuid) => {
  return sendRequest(() => Get(`${ApiActions.Datepicker}/${uuid}`));
};

export const deleteDatepicker = async (uuid) => {
  return sendRequest(() => Delete(`${ApiActions.Datepicker}?uuid=${uuid}`));
};
