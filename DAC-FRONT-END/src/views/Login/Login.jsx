import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';



import { loginUser, selectStatus } from "../../store/authSlice";

import MainButton from "../../components/buttons/MainButton";
import MainInputString from "../../components/inputs/MainInput";
import logo from '../../assets/CH-icon-bg-transparent.png'



export const Login = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = () => {
    // Llama a la acción de inicio de sesión con las credenciales
    dispatch(loginUser(credentials));
    console.log(status);
  };

  return (
    <div className="w-96 m-auto h-fit flex-column-center gap-10 p-4">
      <img className="w-[150px] mx-auto mb-24" src={logo} alt="Logo Community Hunters" />
      <MainInputString
        type={'text'}
        name={'username'}
        placeholder={"Nombre de usuario"}
        value={credentials.username} // Agrega esta línea
        onChange={handleInputChange} // Modifica esta línea
      />
      <MainInputString
        type={'password'}
        name={'password'}
        placeholder={"Contraseña"}
        value={credentials.password} // Agrega esta línea
        onChange={handleInputChange} // Modifica esta línea
      />
      <MainButton
        onClickFunction={handleLogin}
        label={"Iniciar Sesión"}
      />
      {status === "checking" && <p></p>}
      {status === "authenticated" &&   <Navigate to="/dashboard" replace={true} />}
      {status === "not-authenticated" && <p>Credenciales incorrectas.</p>}
    </div>
  );
};
