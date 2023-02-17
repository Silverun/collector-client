import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const refreshToken = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        //Checking if we have access token in header
        if (!config.headers["Authorization"]) {
          //if not setting it to one in state
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }

        console.log("Config from request: ", config);

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        //Access token expired case below
        console.log(
          "error.config from resIntercept(prevRequest) ",
          error.config
        );
        console.log("error response: ", error.response);
        const prevRequest = error?.config;
        console.log("PrevReq.sent before " + JSON.stringify(prevRequest.sent));

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          //Check one time that accessToken has expired and renew it
          prevRequest.sent = true;
          console.log("PrevReq.sent after ", prevRequest);
          const newAccessToken = await refreshToken();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosPrivate(prevRequest);
        }
        // console.log("Coming from here resInt");
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refreshToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;
