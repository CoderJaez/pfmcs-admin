import { url } from "../constants/env";
import axios from "axios";

export const ParamsThresholdService = {
  insertThreshold: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}params-thresholds`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },

  updateThreshold: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}params-thresholds/${values._id}`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },

  deleteThreshold: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}params-thresholds/${id}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },

  getThreshold: async (id = null, search, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}params-thresholds/${id ? id : `?search=${search}`}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },

  _getThreshold: async () => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}summaries/thresholds/`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
};
