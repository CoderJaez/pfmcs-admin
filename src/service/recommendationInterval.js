import axios from "axios";
import { url } from "../constants/env";

export const RecommendationInterval = {
  FindRecommendation: async (config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}rec-intervals`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  NewRecommendation: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}rec-intervals`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  UpdateRecommendation: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}rec-intervals/${values._id}`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
};
