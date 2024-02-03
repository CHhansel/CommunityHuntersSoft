import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle";
import { resetAuthState, selectUser } from "../../store/authSlice";
import Swal from "sweetalert2";
import { resetModulesState } from "../../store/modulesSlice";
import { Navigate } from "react-router-dom";
import exit_icon from "../../assets/logout_icon_black.svg";
import SideBarLogo from "../SideMenu/Logo";

const TopBar = () => {
  const { user } = useSelector(selectUser);
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
        Navigate("/login"); // Asegúrate de que esta es la ruta correcta para tu página de inicio de sesión
      }
    });
  };
  return (
    <div className="w-full flex flex-row p-3 justify-between ">
      <SideBarLogo />
      <div className="flex flex-row items-center gap-10">
        <ThemeToggle></ThemeToggle>
        <div>
        <h2 className="text-black ">{user.name}</h2>
        <h4 className="text-black text-xs ">{user.role}</h4>

        </div>
        <button className="text-black " onClick={handleLogout}>
          {" "}
          <span>
            {" "}
            <img src={exit_icon} alt="exit_icon" className="inline w-6" />{" "}
          </span>{" "}
          Salir
        </button>
      </div>
    </div>
  );
};

export default TopBar;
