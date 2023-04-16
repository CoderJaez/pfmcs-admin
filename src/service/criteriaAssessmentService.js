import { url } from "../constants/env";
import axios from "axios";

export const CriteriaAssessmentService = {
  NewAssessment: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .post(`${url}criteria-assessments`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  UpdateAssesment: async (values, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .put(`${url}criteria-assessments/${values._id}`, values, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  FindAssesments: async (search, page, limit, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(
          `${url}criteria-assessments/?search=${search}&page=${page}&limit=${limit}`,
          config,
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  FindAssesment: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}criteria-assessments/${id}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
  DeleteAssesment: async (id, config) => {
    return await new Promise((resolve, reject) => {
      axios
        .delete(`${url}criteria-assessments/${id}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data));
    });
  },
};
