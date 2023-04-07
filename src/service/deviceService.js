import axios from "axios";
import React from "react";
import { url } from "../constants/env";
export const DeviceService = {
  getData: async (id = null, search) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}devices/${id ? id : `?search=${search}`}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },
  postData: async (data) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}devices`, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },

  updateData: async (data) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}devices/${data._id}`, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },

  deleteData: async (id) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}devices/${id}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(err.rresponse));
    });
  },
};
