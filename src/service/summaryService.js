import axios from "axios";
import { url } from "../constants/env";

export const SummaryReadings = {
  getAllSummaries: async (params) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}summaries`, params)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response));
    });
  },
};
