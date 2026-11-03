import axios from "axios";

const api = axios.create({
  baseURL: "https://paynthra2-0.onrender.com/api",
  withCredentials: true,
});

export default api;
