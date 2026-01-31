import axios from "axios";
import { url } from "../constants/env";

const WaterConsumptionService = {
  getWaterConsumption: async (
    farmId,
    page,
    limit,
    dateFrom,
    dateTo,
    config,
  ) => {
    const params = new URLSearchParams();
    if (farmId) params.append("farmId", farmId);
    if (page !== undefined && page !== null) params.append("page", page);
    if (limit !== undefined && limit !== null) params.append("limit", limit);
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);

    return await new Promise((resolve, reject) => {
      axios
        .get(`${url}water-consumption?${params.toString()}`, config)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response?.data || err));
    });
  },
};

export { WaterConsumptionService };
export default WaterConsumptionService;
