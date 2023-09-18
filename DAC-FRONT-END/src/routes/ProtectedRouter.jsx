import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectStatus } from "../store/authSlice";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const status = useSelector(selectStatus);
  console.log(status);
  switch (status) {
    case "checking":{
      return <div>Cargando...</div>;
    }
    case "idle":{
      return <div>Cargando...</div>;
    }
    case "authenticated":
      return children;
    default:
      return <Navigate to="/login"  />;
  }
};

export default ProtectedRoute;
