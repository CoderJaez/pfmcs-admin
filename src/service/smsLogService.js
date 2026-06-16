import axios from "axios";
import { url } from "../constants/env";

const SmsLogService = {
  getSmsLogs: async (filters = {}, config) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}sms-logs?${params.toString()}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response?.data || err));
    });
  },
};

export { SmsLogService };
export default SmsLogService;
