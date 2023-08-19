import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../views/Login/Login";
import Footer from "../components/footer/index.jsX";
import { useSelector } from "react-redux";
import { selectStatus } from "../store/authSlice";

import { DashboardRoutes } from "./dashboardRoutes";

export const AppRouter = () => {
  const status = useSelector(selectStatus);

  if (status === "loading" || status === "idle") {
    return <div>Loading...</div>;
  }
  return (
    <div className="h-screen flex flex-col ">
      <div className="flex flex-grow">
        <Routes>
          {status === "authenticated" ? (
            <>
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
            <Route path="/login" element={ <Navigate to="/dashboard" />} />  
            </>
          ) : (
            <>
              <Route path="/*" element={<Login />} />
            </>
          )}
        </Routes>
      </div>
      <Footer />
    </div>
  );
};
