import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignHanging } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate, useResolvedPath } from "react-router-dom";
import SideBarLogo from "./Logo/index";
import exit_icon from "../../assets/logout_icon_white.svg";
import { useLocation } from "react-router-dom";
import { resetAuthState, selectUser } from "../../store/authSlice";
import { resetModulesState } from "../../store/modulesSlice";

const SideMenu = () => {
  const location = useLocation();
  const url = useResolvedPath("").pathname;
  const accessibleModules = useSelector(
    (state) => state.modules.accessibleModules.accessModules
  );
  const { user } = useSelector(selectUser);

  const allModules = {
    1: { name: "Propiedades", path: "properties" },
    2: { name: "Clientes", path: "clients"},
    3: { name: "Administración", path: "admin" },
    4: { name: "Facturas", path: "bills" },
    5: { name: "Empleados", path: "employees" },
    6: { name: "Ordenes", path: "orders" },
    // Agrega más módulos según sea necesario
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Swal.fire({
      title: "Desea Salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si!",
    }).then((result) => {
      if (result.isConfirmed) {
        //Borrar la información del localStorage
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        localStorage.removeItem("accessibleModules");
        // Resetear el estado de Redux
        dispatch(resetAuthState());
        dispatch(resetModulesState());
        // Redirige al usuario a la página de inicio de sesión
        navigate("/login"); // Asegúrate de que esta es la ruta correcta para tu página de inicio de sesión
      }
    });
  };
  return (
    <div className="sidebar bg-black flex flex-col justify-between min-h-screen  items-center">
      <div className="my-12 flex flex-col items-center">
        <SideBarLogo />
        <h4 className="text-white mt-8">{user.name}</h4>
        <h4 className="text-white mt-2">{user.role}</h4>
        <h4 className="text-white mt-2 text-center">{user.company_name}</h4>
      </div>
      <div className="flex flex-col justify-start w-52 px-2">
        {accessibleModules.map((module) => {
          const { name, path: modulePath } = allModules[module.module_id];
          const isActive = location.pathname.includes(modulePath);
          return (
            
            <Link
              key={module.module_id}
              to={`${url}/${modulePath}`}
              className={`ease-out duration-500  my-1 w-full py-[6px] px-[12px] border-[0.1px] border-zinc-700 rounded-lg text-center ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-white hover:text-black"
              }`}
            >
            {name}
            </Link>
          );
        })}
      </div>
      <div className="w-[200px] h-14 bg-red-900 flex items-center justify-center pointer">
        <button
          className="text-white w-48 h-10 text-lg "
          onClick={handleLogout}
        >
          {" "}
          <span>
            {" "}
            <img src={exit_icon} alt="exit_icon" className="inline w-10" />{" "}
          </span>{" "}
          Salir
        </button>
      </div>
    </div>
  );
};
export default SideMenu;
