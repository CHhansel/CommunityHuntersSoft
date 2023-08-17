import { Routes, Route } from "react-router-dom";
import { Login } from "../views/Login/Login";
import Footer from "../components/footer/index.jsX";
import { DashboardRoutes } from "./dashboardRoutes";

export const AppRouter = () => {
  const estado = 1;
  return (
    <div className="h-screen flex flex-col ">
      <div className="flex flex-grow">
        <Routes>
          {estado === 1 ? (
            <Route path="/login" element={<Login />} />
            
          ) : (
            <>
            <Route path="/*" element={<DashboardRoutes />} />
            </>
          )}
        </Routes>
      </div>
      <Footer />
    </div>
  );
};
