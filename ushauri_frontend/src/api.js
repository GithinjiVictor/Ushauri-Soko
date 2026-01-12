import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/";

export const getMarkets = (config) => axios.get(API_BASE + "markets/", config);
export const getProduce = (config) => axios.get(API_BASE + "produce/", config);
export const getPriceLogs = (config) => axios.get(API_BASE + "pricelogs/", config);
export const getSales = (config) => axios.get(API_BASE + "salesrecords/", config);
