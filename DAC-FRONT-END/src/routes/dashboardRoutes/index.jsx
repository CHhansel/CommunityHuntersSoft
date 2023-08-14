import { Routes, Route } from "react-router-dom";
import Dashboard from '../dashboardRoutes'


export const DashboardRoutes = () => {


    return (
      <div className="h-full">
        <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    );
  };