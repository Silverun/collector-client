import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refreshToken = async () => {
    const result = await axios.get("/refresh");
    console.log("new access token from refresh", result.data);
    setAuth((prev) => {
      return {
        ...prev,
        id: result.data.id,
        username: result.data.username,
        role: result.data.role,
        accessToken: result.data.accessToken,
      };
    });
    console.log("new auth accessToken after refresh", auth.accessToken);
    return result.data.accessToken;
  };

  return refreshToken;
};

export default useRefreshToken;
