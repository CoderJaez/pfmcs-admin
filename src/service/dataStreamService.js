import { url } from "../constants/env";
import axios from "axios";
export const DataStreamService = {
  postData: async (data, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}data-streams/`, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  putData: async (data, id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}data-streams/${id}`, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },
  getData: async (device_id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}data-streams/?device=${device_id}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  deleteData: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}data-streams/${id}`, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};
