import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignHanging } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useResolvedPath } from "react-router-dom";
import SideBarLogo from "./Logo/index";
import properties_module_icon from "../../assets/properties-module-icon.svg";
import clients_module_icon from "../../assets/clients-module-icon.svg";
import admin_module_icon from "../../assets/admin-module-icon.svg";
import employee_module_icon from "../../assets/employee-module-icon.svg";
import push_pin from "../../assets/push_pin_black.svg";
import push_pin_filled from "../../assets/push_pin_black_filled.svg";
import { useLocation } from "react-router-dom";
import { resetAuthState, selectUser } from "../../store/authSlice";
import { useState } from "react";

const SideMenu = () => {
  const location = useLocation();
  const url = useResolvedPath("").pathname;
  const [fixedMenu, setfixedMenu] = useState(false);
  const accessibleModules = useSelector(
    (state) => state.modules.accessibleModules.accessModules
  );
  const [pinIcon, setPinIcon] = useState(push_pin);
  const allModules = {
    1: {
      name: "Propiedades",
      path: "properties",
      icon: properties_module_icon,
    },
    2: { name: "Clientes", path: "clients", icon: clients_module_icon },
    3: { name: "Administración", path: "admin", icon: admin_module_icon },
    4: { name: "Facturas", path: "bills", icon: employee_module_icon },
    5: { name: "Empleados", path: "employees", icon: properties_module_icon },
    6: { name: "Ordenes", path: "orders", icon: properties_module_icon },
    // Agrega más módulos según sea necesario
  };
  const onclickPin = () => {
    setPinIcon(pinIcon === push_pin ? push_pin_filled : push_pin);
    setfixedMenu(!fixedMenu);
  };
  return (
    <div className=" flex flex-col justify-center">
      <div className="rounded-main bg-white flex flex-col justify-between items-center p-3">
        {/* <div className="flex flex-col gap-7 justify-start w-14 hover:w-52 overflow-hidden duration-300"> */}
        <div
          className={`flex flex-col gap-7 justify-start ${
            fixedMenu ? "w-52" : "w-14 hover:w-52"
          }   overflow-hidden duration-300`}
        >
          <div className="flex justify-start">
            <button onClick={onclickPin}>
              <img src={pinIcon} alt="" />
            </button>
          </div>
          {accessibleModules.map((module) => {
            const {
              name,
              path: modulePath,
              icon,
            } = allModules[module.module_id];
            const isActive = location.pathname.includes(modulePath);
            return (
              <Link
                key={module.module_id}
                to={`${url}/${modulePath}`}
                className={`flex items-center gap-3 rounded-main ease-out duration-500  my-1 w-full py-[6px] px-[12px]  text-center ${
                  isActive
                    ? "bg-main-blue text-white"
                    : "text-black bg-white hover:bg-main-blue hover:text-black"
                }`}
              >
                <img className="w-9 h-9" src={icon} alt={name} /> {name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default SideMenu;
