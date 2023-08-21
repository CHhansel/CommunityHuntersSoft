import { useSelector } from "react-redux";
import Property from "../../views/Property";
import { Link, useResolvedPath } from "react-router-dom";
import SideBarLogo from "./Logo/index";

const SideMenu = () => {
  const url = useResolvedPath("").pathname;
  const accessibleModules = useSelector(
    (state) => state.modules.accessibleModules.accessModules
  );

  const allModules = {
    1: { name: "Propiedades", path: "properties", component: Property },
    2: { name: "Clientes", path: "clients", component: Property },
    3: { name: "Contratos", path: "contracts", component: Property },
    4: { name: "Administración", path: "bills", component: Property },
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
              className="text-white my-1 w-full py-3 border-[0.1px] border-zinc-700 text-center hover:bg-gray-900"
            >
              {name}
            </Link>
          );
        })}
      </div>
      <button className="text-white">Salir</button>
    </div>
  );
};
export default SideMenu;
