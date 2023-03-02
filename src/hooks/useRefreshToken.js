import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  // const checkBlock = useCallback(async () => {
  //   const response = await axios.post("/user/checkblocked", auth);
  //   const status = response.data;
  //   if (status === "active") return;
  //   if (status === "blocked") {
  //     console.log("Blocked");
  //     await logout();
  //   }
  // }, []);

  // useEffect(() => {
  //   checkBlock();
  // }, []);

  const refreshToken = async () => {
    const result = await axios.get("/refresh");
    setAuth((prev) => {
      console.log("Refreshing access token");
      console.log("Prev state accToken " + prev.accessToken);
      console.log("New accToken " + result.data.accessToken);
      return {
        ...prev,
        id: result.data.id,
        username: result.data.username,
        role: result.data.role,
        accessToken: result.data.accessToken,
      };
    });

    return result.data.accessToken;
  };

  return refreshToken;
};

export default useRefreshToken;
