import { Routes, Route } from "react-router-dom";
import { Login } from "../views/Login/Login";



import { DashboardRoutes } from "./dashboardRoutes";
import ProtectedRoute from "./ProtectedRouter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../store/authSlice";
import { setAccessibleModulesFromLocalStorage } from "../store/modulesSlice";


export const AppRouter = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('auth'));
    const token = localStorage.getItem('token');

    if (user && token) {
      dispatch(setUserFromLocalStorage({ user, token }));
      const accessibleModules = JSON.parse(localStorage.getItem('accessibleModules'));
      dispatch(setAccessibleModulesFromLocalStorage(accessibleModules))
    }
  }, [dispatch]);
  return (
    <div className="h-screen flex flex-col ">
      <div className="flex flex-grow">
        <Routes>
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <DashboardRoutes />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          {/* Otras rutas que no requieran autenticación */}
        </Routes>
      </div>
    </div>
  );
};

