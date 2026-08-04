import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { useRefreshTokenMutation } from "./api/DataSlice";
import { setToken } from "./AppSlice";

const PersistLogin = (): React.JSX.Element => {
  const [refresh,{isError, isSuccess,isLoading}] = useRefreshTokenMutation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const effectRan = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        const response = await refresh();

        // if (isMounted) {
          dispatch(setToken(response.data));
          setSuccess(true);
        // }
      } catch (err) {
        console.error("Refresh token failed:", err);

        if (isMounted) {
          setSuccess(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!effectRan.current) {
      verifyRefreshToken();
      effectRan.current = true;
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, refresh]);

  if (isLoading) {
    return <div>Loading...</div>;
    // return <Loader />;
  }

  // if (!isSuccess) {
  //   return <Navigate to="/login" replace />;
  // }
  // const { } = useAuth();

  return (<Outlet />);
};

export default PersistLogin;