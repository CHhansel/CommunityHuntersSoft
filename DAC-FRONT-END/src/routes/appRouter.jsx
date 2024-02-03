import { Routes, Route } from "react-router-dom";
import { Login } from "../views/Login/Login";

import { DashboardRoutes } from "./dashboardRoutes";
import ProtectedRoute from "./ProtectedRouter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../store/authSlice";
import { setAccessibleModulesFromLocalStorage } from "../store/modulesSlice";
import ResetPasswordRequest from "../views/ResetPassword/ResetPasswordRequest";
import ResetPasswordUpdate from "../views/ResetPassword/ResetPasswordUpdate";

export const AppRouter = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("auth"));
    const token = localStorage.getItem("token");

    if (user && token) {
      dispatch(setUserFromLocalStorage({ user, token }));
      const accessibleModules = JSON.parse(
        localStorage.getItem("accessibleModules")
      );
      dispatch(setAccessibleModulesFromLocalStorage(accessibleModules));
    }
  }, [dispatch]);
  return (
    <div className="h-screen flex flex-col bg-[#F7F7F9] ">
      <div className="flex flex-grow">
        <Routes>
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardRoutes />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/resetPasswordRequest"
            element={<ResetPasswordRequest />}
          />
          <Route path="/resetPassword" element={<ResetPasswordUpdate />} />

          {/* Otras rutas que no requieran autenticación */}
        </Routes>
      </div>
    </div>
  );
};
