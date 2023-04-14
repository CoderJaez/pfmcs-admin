import axios from "axios";
import { url } from "../constants/env";

export const UserService = {
  login: async (email, password) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}auth/login`, { email, password })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(res.response));
    });
  },
  CheckToken: async (config) => {
    const _token = sessionStorage.getItem("token");
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}auth/token`, { token: _token }, config)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => reject(err.response.data));
    });
  },
  UpdateUser: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}users/${values._id}`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  FindUser: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}users/${id}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  FindUsers: async (search, page, limit, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}users?search=${search}&page=${page}&limit=${limit}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  NewUser: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}users`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  SetDefaultPass: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}users/default-pass/${id}`, { set_default: true }, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  DeleteUser: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}users/${id}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
};
