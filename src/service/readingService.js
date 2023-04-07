import axios from "axios";
import React from "react";
import { url } from "../constants/env";

export const ReadingService = {
  getReadings: async (search, page, limit, dateFrom, dateTo) => {
    return await new Promise((resolve, reject) => {
      axios
        .get(
          `${url}readings?search=${search}&page=${page}&limit=${limit}&date_from=${dateFrom}&date_to=${dateTo}`,
        )
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response));
    });
  },
};
