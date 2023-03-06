import axios from "axios";
const serverUrl = "https://colltest.herokuapp.com";
// const serverUrl = "http://localhost:5000";

export default axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: serverUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
