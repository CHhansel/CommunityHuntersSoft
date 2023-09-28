import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  loginUser,
  selectStatus,
  selectUser,
  setUserFromLocalStorage,
} from "../../store/authSlice";

import MainButton from "../../components/buttons/MainButton";
import MainInputString from "../../components/inputs/MainInput";
import logo from "../../assets/DAC-icon-bg-transparent.png";
import {
  fetchAccessibleModules,
  setAccessibleModulesFromLocalStorage,
} from "../../store/modulesSlice";
import Footer from "../../components/footer/index";
import { Link, useNavigate } from "react-router-dom";
import arrow from "../../assets/arrow-forward.svg";
import FontSizeAdjuster from "../../components/FontSizeAjust";

export const Login = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("auth"));
    const token = localStorage.getItem("token");

    if (user && token) {
      dispatch(setUserFromLocalStorage({ user, token }));
      const accessibleModules = JSON.parse(
        localStorage.getItem("accessibleModules")
      );
      dispatch(setAccessibleModulesFromLocalStorage(accessibleModules));
    }
  }, [dispatch]);
  const { user } = useSelector(selectUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = () => {
    // Llama a la acción de inicio de sesión con las credenciales
    dispatch(loginUser(credentials)).then((response) => {
      if (response && response.payload && response.payload.token) {
        const token = response.payload.token;
        const id = response.payload.user.id;
        const user_role_id = response.payload.user.role_id;
        dispatch(fetchAccessibleModules({ id, user_role_id, token })).then(
          (modulesResponse) => {
            if (modulesResponse && modulesResponse.payload) {
              // Guarda la información en localStorage
              localStorage.setItem(
                "accessibleModules",
                JSON.stringify(modulesResponse.payload)
              );
            }
          }
        );
        const user = response.payload.user;
        localStorage.setItem("auth", JSON.stringify(user));
        localStorage.setItem("token", token);
        // Redirige al usuario al dashboard después de un inicio de sesión exitoso
        navigate("/dashboard");
      } else {
        // Maneja el caso de inicio de sesión fallido si es necesario
      }
    });
  };
  return (
    <div className="m-auto w-100 h-screen flex flex-col justify-between grow-0">
      <div className="absolute top-0 right-[28px]">
        <FontSizeAdjuster />
      </div>
      <div className="w-96 m-auto h-fit flex-column-center gap-10 p-4">
        <img
          className="w-[250px] mx-auto mb-24"
          src={logo}
          alt="Logo Community Hunters"
        />
        <MainInputString
          type={"text"}
          name={"username"}
          placeholder={"Nombre de usuario"}
          value={credentials.username} // Agrega esta línea
          onChange={handleInputChange} // Modifica esta línea
        />
        <MainInputString
          type={"password"}
          name={"password"}
          placeholder={"Contraseña"}
          value={credentials.password} // Agrega esta línea
          onChange={handleInputChange} // Modifica esta línea
        />

        <MainButton onClickFunction={handleLogin} label={"Iniciar Sesión"} />
        <div>
          <a
            href="/resetPasswordRequest"
            className="inline p-2 text-main-blue border-b-2 border-white hover:border-main-blue ease-out duration-500 "
          >
            Olvido su contraseña?
          </a>
        </div>
        {status === "checking" && <p></p>}
        {status === "not-authenticated" && <p>Credenciales incorrectas.</p>}
      </div>

      {status === "authenticated" && (
        <Link
          className={` flex justify-center ease-out duration-500 my-1 px-6 py-3  `}
          to={`/dashboard`}
        >
          continuar como {user.name}{" "}
          <img className="ml-5 w-4" src={arrow} alt="ir" />
        </Link>
      )}

      <div className="w-100">
        <Footer />
      </div>
    </div>
  );
};
