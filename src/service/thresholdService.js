import { url } from "../constants/env";
import axios from "axios";

export const ParamsThresholdService = {
  insertThreshold: async (values) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}params-thresholds`, values)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },

  updateThreshold: async (values) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}params-thresholds/${values._id}`, values)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },

  deleteThreshold: async (id) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}params-thresholds/${id}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },

  getThreshold: async (id = null, search) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}params-thresholds/${id ? id : `?search=${search}`}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
};
