import axios from "axios";
import React, { useContext } from "react";
import { url } from "../constants/env";

export const DeviceService = {
  getData: async (id = null, search, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}devices/${id ? id : `?search=${search}`}`, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  postData: async (data, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}devices`, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },

  updateData: async (data, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}devices/${data._id}`, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },

  deleteData: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}devices/${id}`, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(err.rresponse));
    });
  },
};
