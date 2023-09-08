import { useSelector } from "react-redux";
import Property from "../../views/Property";
import { Link, useResolvedPath } from "react-router-dom";
import SideBarLogo from "./Logo/index";
import exit_icon from '../../assets/logout_icon_white.svg'



const SideMenu = () => {
  const url = useResolvedPath("").pathname;
  const accessibleModules = useSelector(
    (state) => state.modules.accessibleModules.accessModules
  );

  const allModules = {
    1: { name: "Propiedades", path: "properties", component: Property },
    2: { name: "Clientes", path: "clients", component: Property },
    3: { name: "Contratos", path: "contracts", component: Property },
    4: { name: "Administración", path: "admin", component: Property },
    5: { name: "Facturas", path: "bills", component: Property },
    6: { name: "Empleados", path: "bills", component: Property },
    // Agrega más módulos según sea necesario
  };
  return (
    <div className="sidebar bg-black flex flex-col justify-between	 min-h-screen w-[200px] items-center">
      <div className="my-12">
        <SideBarLogo />
      </div>
      <div className="flex flex-col justify-start w-[200px] px-2">
        {accessibleModules.map((module) => {
          const { name, path: modulePath } = allModules[module.module_id];
          return (
            <Link 
              key={module.module_id}
              to={`${url}/${modulePath}`}
              className="text-white my-1 w-full py-3 border-[0.1px] border-zinc-700 rounded-lg text-center hover:bg-gray-900"
            >
              {name}
            </Link>
          );
        })}
      </div>
      <div className="w-[200px] h-14 bg-red-900 flex items-center justify-center pointer">
        <button className="text-white w-48 h-10 text-lg "> <span> <img src={exit_icon} alt="exit_icon" className="inline w-10"/> </span> Salir</button>
      </div>
    </div>
  );
};
export default SideMenu;
