import axios from "axios";
import { url } from "../constants/env";

export default axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});
