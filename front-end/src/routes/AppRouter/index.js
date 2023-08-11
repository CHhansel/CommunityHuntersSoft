import React from "react";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import { Login } from "../../Pages/Login";
//import { Welcome } from "../../Pages/Welcome";
//import { PasswordRecovery } from "../../Pages/PasswordRecovery";
//import { PasswordChange } from "../../Pages/PasswordChange";

//import { DashboardRoutes } from "../DashboardRoutes";

export const AppRouter = () => {
  const { status, checkAuthToken } = useAuthStore();
  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    //return <LoadingComponent />;
  }

  return (
    <div className="">
      <Routes>
        {status === "not-authenticated" ? (
          <>
            {/* <Route path="/*" element={<Welcome />} /> */}
            <Route path="login" element={<Login />} />
{/* 
            <Route path="password-recovery" element={<PasswordRecovery />} />
            <Route path="password-change" element={<PasswordChange />} /> */}
          </>
        ) : (
          <>
            {/* <Route path="/*" element={<DashboardRoutes />} /> */}
            <Route path="/login" element={<Navigate to="/" />} />
            
          </>
        )}
        {/* <Route path="*" element={<NotFound />} />  */}
      </Routes>
    </div>
  );
};

// const LoadingComponent = () => (
//   <div>
//     <h3>Cargando...</h3>
//     {/* Aquí puedes agregar cualquier estilo o animación de carga que te guste */}
//   </div>
// );

// const NotFound = () => (
//   <div>
//     <h3>Página no encontrada</h3>
//     {/* Aquí puedes diseñar una página de error 404 más atractiva */}
//   </div>
//);
