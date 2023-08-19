import { Routes, Route } from "react-router-dom";
import Dashboard from '../../views/Dashboard'
import Property from "../../views/Property";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../../components/SideMenu";
import { fetchAccessibleModules } from "../../store/modulesSlice";
import { selectUser } from '../../store/authSlice'; // Ajusta la ruta según tu estructura

//import { useSelector } from 'react-redux';



export const DashboardRoutes = () => {

  // const status = useSelector((state) => state.modules.status);
  
  // // Si los datos están cargando, muestra un mensaje o un spinner
  const {user, token} = useSelector(selectUser);
  // // Si ha ocurrido un error, muestra un mensaje de error
  console.log(user,"sisisi");

  const id = user.id;
  const user_role_id = user.role_id;
  useDispatch(fetchAccessibleModules({id, user_role_id, token }));
  const accessibleModules = useSelector((state) => state.modules.accessibleModules);
  console.log(id, user_role_id, token,accessibleModules,"moduless");
  const status = useSelector((state) => state.modules.status);

  if (status === 'loading' || status === 'idle') {
    return <div>Loading dashboards ...</div>;
  }
  

    return (
      <div className="h-full">
        <SideMenu accessModules={accessibleModules.accessModules}></SideMenu>
        <Routes>
        <Route index element={<Dashboard />} />
        <Route path="/*" element={<Dashboard />}>
          <Route path="properties" element={<Property />} />
          <Route path="clients" element={<Property />} />
        </Route>
      </Routes>
      </div>
    );
  };