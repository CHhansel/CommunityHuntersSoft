import { useDispatch, useSelector } from "react-redux";
import connection from "../api/connection-api";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "../store/authSlice/authSlice";

export const useLogin = () => {
  const { status, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());

    try {
      const { data } = await connection.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin(data.user));
    } catch (error) {
      dispatch(onLogout("Credenciales Incorrectas"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10000);
    }
  };

  return {
    status,
    errorMessage,
    startLogin,
  };
};
