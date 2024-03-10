import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import properties_module_icon_folly from "../../assets/menu-icons/properties-module-icon.svg";
import clients_module_icon_folly from "../../assets/menu-icons/clients-module-icon.svg";
import admin_module_icon_folly from "../../assets/menu-icons/admin-module-icon.svg";
import employee_module_icon_folly from "../../assets/menu-icons/employee-module-icon.svg";
import dashboard_module_icon_folly from "../../assets/menu-icons/dashboard-module-icon.svg";
import restaurant_table_module_icon_folly from "../../assets/menu-icons/restaurant-table-module-icon.svg";
import restaurant_order_module_icon_folly from "../../assets/menu-icons/restaurant-order-module-icon.svg";
import bills_module_icon_folly from "../../assets/menu-icons/bills-module-icon.svg";
import push_pin from "../../assets/push_pin_black.svg";
import push_pin_filled from "../../assets/push_pin_black_filled.svg";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const SideMenu = () => {
  const location = useLocation();

  const [fixedMenu, setfixedMenu] = useState(false);
  const accessibleModules = useSelector(
    (state) => state.modules.accessibleModules.accessModules
  );
  const [pinIcon, setPinIcon] = useState(push_pin);
  const hoverTimer = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const icons = {
    dashboard_module_icon_folly,
    properties_module_icon_folly,
    clients_module_icon_folly,
    admin_module_icon_folly,
    restaurant_table_module_icon_folly,
    restaurant_order_module_icon_folly,
    bills_module_icon_folly,
    employee_module_icon_folly
    // ... mapea el resto de tus iconos
  };

  const onclickPin = () => {
    setPinIcon(pinIcon === push_pin ? push_pin_filled : push_pin);
    setfixedMenu(!fixedMenu);
  };
  const handleMouseEnter = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!fixedMenu) {
      hoverTimer.current = setTimeout(() => {
        setIsHovered(false);
      }, 1500); // Retraso de 2 segundos
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current);
      }
    };
  }, []);
  return (
    <div className=" flex flex-col justify-center">
      <div className="rounded-main bg-white flex flex-col justify-between items-center p-2 ">
        {/* <div className="flex flex-col gap-7 justify-start w-14 hover:w-52 overflow-hidden duration-300"> */}
        <div
          className={`flex flex-col gap-1 justify-start ${
            fixedMenu || isHovered ? "w-52" : "w-14"
          } overflow-hidden duration-300`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex justify-start">
            <button onClick={onclickPin}>
              <img src={pinIcon} alt="fijar" />
            </button>
          </div>
          {accessibleModules.map((module) => {
            const icon = icons[module.icon_name]; // Accede al icono usando el nombre
            const isActive = location.pathname.includes(module.url);
            return (
              <Link
                key={module.module_id}
                to={`/${module.module_url}`}
                className={`flex items-center gap-3 rounded-main ease-out duration-500   w-full py-[4px] px-[10px]  text-center ${
                  isActive
                    ? "bg-main-blue text-white"
                    : "text-black bg-white hover:bg-main-blue hover:text-black"
                }`}
              >
                <img className="w-12 h-12" src={icon} alt={module.module_name} /> {module.module_name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default SideMenu;


