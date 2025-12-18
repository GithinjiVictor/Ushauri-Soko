import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/";

export const getMarkets = () => axios.get(API_BASE + "markets/");
export const getProduce = () => axios.get(API_BASE + "produce/");
export const getPriceLogs = () => axios.get(API_BASE + "pricelogs/");
export const getSales = () => axios.get(API_BASE + "sales/");
