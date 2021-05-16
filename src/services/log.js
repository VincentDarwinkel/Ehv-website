import ApiActions from "services/shared/api/ApiActions";
import { Delete, Get } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";
import { arrayToQueryString } from "./shared/request-helper";

export const AllLogs = async () => {
  return sendRequest(() => Get(ApiActions.Log));
};

export const RemoveLogs = async (uuids) => {
  return sendRequest(() => Delete(`${ApiActions.Log}${arrayToQueryString(uuids, "uuid-collection")}`));
};
