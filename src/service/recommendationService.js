import axios from "axios";
import { url } from "../constants/env";

export const RecommendationService = {
  GetRecommendations: async (
    search,
    page,
    limit,
    date_from,
    date_to,
    config,
  ) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(
          `${url}recommendations?search=${search}&page=${page}&limit=${limit}&date_from=${date_from}&date_to=${date_to}`,
          config,
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },

  GetRecentRecommendation: async () => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}recommendations/recent`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
};
