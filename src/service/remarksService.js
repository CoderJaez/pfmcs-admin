import { url } from "../constants/env";
import axios from "axios";

export const RemmarkService = {
  getRemarks: async (search) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}remarks?search=${search}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response));
    });
  },
  insertRemark: async (values) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}remarks`, values)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response));
    });
  },
  putRemark: async (values) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}remarks/${values._id}`, values)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response));
    });
  },
  deleteRemark: async (id) => {
    return await new Promise((resolve, reject) =>
      axios
        .delete(`${url}remarks/${id}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response)),
    );
  },
};
