import { url } from "../constants/env";
import axios from "axios";

const FarmService = {
  postFarm: async (data, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}farms/`, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  putFarm: async (id, data, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}farms/${id}`, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  },

  getFarm: async (search, page, limit, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}farms?search=${search}&page=${page}&limit=${limit}`, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(err.response.data));
    });
  },
  deleteFarm: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}farms/${id}`, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  getFarmById: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}farms/${id}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
};
export default FarmService;
export { FarmService };
