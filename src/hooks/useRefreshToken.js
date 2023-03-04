import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refreshToken = async () => {
    const result = await axios.get("/refresh");
    // was prev here
    setAuth({
      id: result.data.id,
      username: result.data.username,
      role: result.data.role,
      accessToken: result.data.accessToken,
    });
    return result.data.accessToken;
  };

  return refreshToken;
};

export default useRefreshToken;
