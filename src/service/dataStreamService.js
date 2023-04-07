import { url } from "../constants/env";
import axios from "axios";
export const DataStreamService = {
  postData: async (data) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}data-streams`, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },
  putData: async (data, id) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}data-streams/${id}`, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },
  getData: async (device_id) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}data-streams/?device=${device_id}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response));
    });
  },
  deleteData: async (id) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}data-streams/${id}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },
};
