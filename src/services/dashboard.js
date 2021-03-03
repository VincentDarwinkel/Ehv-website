import ApiActions from "services/shared/api/ApiActions";
import { Get } from "./shared/api/Api";
import { sendRequest } from "./shared/api/api-middleware";

export const GetDashboardInfo = async () => {
  return await sendRequest(() => Get(ApiActions.Dashboard));
};
