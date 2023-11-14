import { Routes, Route } from "react-router-dom";
import Dashboard from "../../views/Dashboard";
import Property from "../../views/Property";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../../components/SideMenu";
import { fetchAccessibleModules } from "../../store/modulesSlice";
import { selectUser } from "../../store/authSlice"; // Ajusta la ruta según tu estructura
import Footer from "../../components/footer/index.jsX";
import Breadcrumb from "../../components/breadcrumbs";
import Customer from "../../views/Customer";
import ConfigRouter from "../ConfigRouter";
import withProtectedAccess from "../../components/HOC/withProtectedAccess";
import Employee from "../../views/Employee";
import FontSizeAdjuster from "../../components/FontSizeAjust";
import Billing from "../../views/Billing";
//import { useSelector } from 'react-redux';

export const DashboardRoutes = () => {
  // const status = useSelector((state) => state.modules.status);

  // // Si los datos están cargando, muestra un mensaje o un spinner
  const { user, token } = useSelector(selectUser);
  // // Si ha ocurrido un error, muestra un mensaje de error

  const user_id = user.id;
  const user_role_id = user.role_id;
  useDispatch(fetchAccessibleModules({ user_id, user_role_id, token }));
  const ProtectedProperty = withProtectedAccess(Property, 1);

  const status = useSelector((state) => state.modules.status);

  if (status === "loading" || status === "idle") {
    return <div>Loading dashboards ...</div>;
  }

  return (
    <div className="max-h-screen w-full flex flex-row">
      <div className="w-52 h-full">
        <SideMenu></SideMenu>
      </div>

      <div className="overflow-y-auto flex flex-col w-full min-h-screen justify-between relative ">
        <div className="absolute top-0 right-[28px]">
          <FontSizeAdjuster />
        </div>
        <div className="mt-5">
        <Breadcrumb />
          <div className="grow">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="/properties" element={<ProtectedProperty />} />
              <Route path="/clients" element={<Customer />} />
              <Route path="/admin/*" element={<ConfigRouter />} />
              <Route path="/employees" element={<Employee />} />
              <Route path="/bills" element={<Billing />} />
            </Routes>
          </div>
        </div>
        <div className="mt-28">
          <Footer />
        </div>
      </div>
    </div>
  );
};
