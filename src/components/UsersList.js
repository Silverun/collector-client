import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UsersList = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  // const effectRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    console.log("Users list Mounted, isMounted: " + isMounted);

    const controller = new AbortController();
    // console.log(controller.signal, "After new instance");

    const getUsers = async () => {
      try {
        const result = await axiosPrivate.get("/admin/users", {
          signal: controller.signal,
        });
        // console.log(controller.signal, "inside fun");
        console.log("Result data from /admin/users ", result.data.users);
        console.log(isMounted + " isMounted before setUsers");
        isMounted && setUsers(result.data.users);
      } catch (err) {
        //we don't have valid refresh token inside a cookie
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      //cancel any pending request when the component unmounts
      isMounted = false;
      // controller.abort();
      // console.log(controller.signal);

      console.log("Users list Unmounted, isMounted: " + isMounted);
    };

    // effectRef.current = true;
  }, [axiosPrivate, navigate, location]);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.userName}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default UsersList;
