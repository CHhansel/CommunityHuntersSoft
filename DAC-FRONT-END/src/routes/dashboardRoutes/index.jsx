import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "../../views/Dashboard";
import Property from "../../views/Property";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../../components/SideMenu";
import { fetchAccessibleModules } from "../../store/modulesSlice";
import { selectUser } from "../../store/authSlice"; // Ajusta la ruta según tu estructura
import Footer from "../../components/footer/index.jsx";
import Breadcrumb from "../../components/breadcrumbs";
import Customer from "../../views/Customer";
import ConfigRouter from "../ConfigRouter";
import withProtectedAccess from "../../components/HOC/withProtectedAccess";
import Employee from "../../views/Employee";
import Billing from "../../views/Billing";
import TopBar from "../../components/top-bar";
//import ProductCreate from "../../views/Restaurant/Food";
import Menu from "../../views/Restaurant/Menu";
import Tables from "../../views/Restaurant/Tables";
import CreateOrders from "../../views/Restaurant/Orders/CreateOrder";
import OrdersView from "../../views/Restaurant/Orders/OrdersView";
import KitchenView from "../../views/Restaurant/Kitchen";
import EditOrderProducts from "../../views/Restaurant/Orders/OrdersView/EditOrderProducts";
import PointOfSale from "../../views/PointOfSale";
import Facturador from "../../views/Facturador";
//import { useSelector } from 'react-redux';

export const DashboardRoutes = () => {
  // const status = useSelector((state) => state.modules.status);

  // // Si los datos están cargando, muestra un mensaje o un spinner
  const { user, token } = useSelector(selectUser);
  // // Si ha ocurrido un error, muestra un mensaje de error
  const { pathname } = useLocation(); // Obtiene la ruta actual

  const user_id = user.id;
  const user_role_id = user.role_id;
  useDispatch(fetchAccessibleModules({ user_id, user_role_id, token }));
  const ProtectedProperty = withProtectedAccess(Property, 1);
  const status = useSelector((state) => state.modules.status);

  if (status === "loading" || status === "idle") {
    return <div>Loading dashboards ...</div>;
  }
  // Si la ruta es exactamente '/Mesas', muestra solo el componente Tables
  if (pathname === "/Cocina") {
    return <KitchenView />;
  }

  return (
    <div className="w-full h-[100vh] flex flex-col justify-between">
      <div className="w-full h-[7vh]">
        <TopBar></TopBar>
      </div>
      <div className="w-full flex flex-row flex-grow-[5] ">
        <div className="h-full flex justify-center">
          <SideMenu></SideMenu>
        </div>

        <div className="flex flex-col w-full justify-between overflow-y-auto">
          <div className=" ">
            <div className="h-[3vh] ">
            <Breadcrumb />

            </div>
            <div className="grow h-[86vh]">
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="/propiedades" element={<ProtectedProperty />} />
                <Route path="/clientes" element={<Customer />} />
                <Route path="/administracion/*" element={<ConfigRouter />} />
                <Route path="/empleados" element={<Employee />} />
                <Route path="/nueva-orden" element={<CreateOrders />} />
                <Route
                  path="/editar-orden/:ordenId"
                  element={<EditOrderProducts />}
                />
                <Route path="/ordenes" element={<OrdersView />} />
                <Route path="/facturas" element={<Billing />} />
                <Route path="/Productos" element={<Menu />} />
                <Route path="/Mesas" element={<Tables />} />
                <Route
                  path="/punto-de-venta/:ordenId"
                  element={<PointOfSale />}
                />
                <Route path="/Facturador" element={<Facturador />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[3vh] ">
        <Footer />
      </div>
    </div>
  );
};
