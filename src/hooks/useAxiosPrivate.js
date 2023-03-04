import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const refreshToken = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        //Checking if we have access token in header
        console.log(
          "axios interceptor request - config.headers",
          config.headers
        );
        if (!config.headers["Authorization"]) {
          //if not setting it to one in state
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        // config.params = {
        //   userid: auth.id,
        // };
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        //Access token expired case below
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          //Check one time that accessToken has expired and renew it
          prevRequest.sent = true;
          const newAccessToken = await refreshToken();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosPrivate(prevRequest);
        }
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
