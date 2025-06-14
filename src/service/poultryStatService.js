import { url } from "../constants/env";
import axios from "axios";

const PoultryStatService = {
  postPoultryStat: async (data, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}poultry-stats/`, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },

  getPoultryStat: async (search, page, limit, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(
          `${url}poultry-stats?search=${search}&page=${page}&limit=${limit}`,
          config
        )
        .then((res) => {
          const poultryStats = res.data.data.map((stat) => ({
            _id: stat._id,
            farm: stat.farm.name,
            createdAt: stat.createdAt,
            type: stat.type,
            value: stat.value,
          }));

          resolve({
            data: poultryStats,
            totalRecords: res.data.totalRecords,
          });
        })
        .catch((err) => reject(err.response.data));
    });
  },

  deletePoultryStat: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}poultry-stats/${id}`, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },

  getPoultryStatById: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}poultry-stats/${id}`, config)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => reject(err.response.data));
    });
  },

  updatePoultryStat: async (id, data, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}poultry-stats/${id}`, data, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};
export default PoultryStatService;
