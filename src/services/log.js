import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const AllLogs = async () => {
  return await sendRequest(() => Get(ApiActions.Log));
};

export const RemoveLogs = async (uuids) => {
  return await sendRequest(() => Delete(ApiActions.Log, uuids));
};
