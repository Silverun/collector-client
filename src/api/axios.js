import axios from "axios";
const serverUrl = "https://cltr.herokuapp.com/";

export default axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: serverUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
