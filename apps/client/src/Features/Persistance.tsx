import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useRefreshTokenMutation } from "./api/DataSlice";
import { setToken } from "./AppSlice";
import Loader from "../components/Loader";

const PersistLogin = (): React.JSX.Element => {
  const [refresh] = useRefreshTokenMutation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        const accessToken = await refresh(undefined).unwrap();
        if (isMounted) {
          dispatch(setToken(accessToken));
          setAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          dispatch(setToken(null));
          setAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void verifyRefreshToken();

    return () => {
      isMounted = false;
    };
  }, [dispatch, refresh]);

  if (loading) return <Loader message="Verifying your session..." />;

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PersistLogin;