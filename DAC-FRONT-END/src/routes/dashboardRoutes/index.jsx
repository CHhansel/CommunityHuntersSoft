import { Routes, Route } from "react-router-dom";
import Dashboard from "../../views/Dashboard";
import Property from "../../views/Property";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../../components/SideMenu";
import { fetchAccessibleModules } from "../../store/modulesSlice";
import { selectUser } from "../../store/authSlice"; // Ajusta la ruta según tu estructura
import Footer from "../../components/footer/index.jsX";
import TopBar from "../../components/TopMenu";
import Breadcrumb from "../../components/breadcrumbs";
import Customer from "../../views/Customer";
//import { useSelector } from 'react-redux';

export const DashboardRoutes = () => {
  // const status = useSelector((state) => state.modules.status);

  // // Si los datos están cargando, muestra un mensaje o un spinner
  const { user, token } = useSelector(selectUser);
  // // Si ha ocurrido un error, muestra un mensaje de error

  const id = user.id;
  const user_role_id = user.role_id;
  useDispatch(fetchAccessibleModules({ id, user_role_id, token }));

  const status = useSelector((state) => state.modules.status);

  if (status === "loading" || status === "idle") {
    return <div>Loading dashboards ...</div>;
  }

  return (
    <div className="h-full w-full flex flex-row">
      <div className="w-[200px] fixed">
        <SideMenu></SideMenu>
      </div>
      <div className="flex flex-col min-h-screen justify-between ml-[200px] w-[calc(100%-200px)]"> 
        <div className="w-100 h-[50px]"> 
         <TopBar/>
        </div>
         <Breadcrumb />
        <div className="grow ">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/properties" element={<Property />} />
            <Route path="/clients" element={<Customer />} />
          </Routes>
        </div>
        <div className="">
          <Footer />
        </div>
      </div>
    </div>
  );
};
