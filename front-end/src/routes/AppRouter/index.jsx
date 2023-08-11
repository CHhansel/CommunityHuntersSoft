import { Routes, Route, Navigate } from "react-router-dom";
//import { useAuthStore } from "../../hooks/useAuthStore";
import { Login } from "../../Views/login";


export const AppRouter = () => {


  return (
    <div className="">
      <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
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
