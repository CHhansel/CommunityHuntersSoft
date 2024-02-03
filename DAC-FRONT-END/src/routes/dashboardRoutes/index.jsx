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
import ThemeToggle from "../../components/ThemeToggle";
import Orders from "../../views/Restaurant/Orders/OrdersView";
import TopBar from "../../components/top-bar";
//import ProductCreate from "../../views/Restaurant/Food";
import Menu from "../../views/Restaurant/Menu";
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
    <div className="w-full  min-h-screen flex flex-col justify-between">
      <div className="w-full ">
        <TopBar></TopBar>
      </div>
      <div className="w-full flex flex-row flex-grow-[5] ">
        <div className="h-full flex justify-center">
          <SideMenu></SideMenu>
        </div>

        <div className="flex flex-col w-full max-h-[800px] justify-between overflow-y-auto">
          <div className=" ">
            <Breadcrumb />
            <div className="grow">
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="/propiedades" element={<ProtectedProperty />} />
                <Route path="/clientes" element={<Customer />} />
                <Route path="/administracion/*" element={<ConfigRouter />} />
                <Route path="/empleados" element={<Employee />} />
                <Route path="/ordenes" element={<Orders />} />
                <Route path="/facturas" element={<Billing />} />
                <Route path="/comidas" element={<Menu />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};
