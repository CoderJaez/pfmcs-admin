import { create } from "zustand";

import FarmService from "../service/farmService";

const useFarmStore = create(() => ({
  getFarm: (config) => {
    const farms = sessionStorage.getItem("farms");
    if (farms) {
      const farmData = JSON.parse(farms);
      return Promise.resolve(farmData);
    }
    FarmService.getFarm("", 0, 10, config)
      .then((res) => {
        const farmData = res.data.map((f) => ({
          _id: f._id,
          name: f.name,
        }));
        sessionStorage.setItem("farms", JSON.stringify(farmData));
      })
      .catch((err) => {
        console.error("Error fetching farm:", err);
      });
  },
}));

export default useFarmStore;
