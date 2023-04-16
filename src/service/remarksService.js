import { url } from "../constants/env";
import axios from "axios";

export const RemmarkService = {
  getRemarks: async (search, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}remarks?search=${search}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  insertRemark: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}remarks`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  putRemark: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}remarks/${values._id}`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  deleteRemark: async (id, config) => {
    return await new Promise((resolve, reject) =>
      axios
        .delete(`${url}remarks/${id}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data)),
    );
  },
};
