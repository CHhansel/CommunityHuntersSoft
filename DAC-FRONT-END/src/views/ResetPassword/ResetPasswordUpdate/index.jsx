import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  selectErrorMessage,
} from "../../../store/authSlice/index"; // Ajusta la ruta a tu slice

const ResetPasswordUpdate = () => {
  const dispatch = useDispatch();
  const reduxErrorMessage = useSelector(selectErrorMessage);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submited, setSubmited] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Verificar que ambas contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Obtener el token desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const actionResult = await dispatch(
      resetPassword({ token, newPassword: password })
    );
    if (resetPassword.fulfilled.match(actionResult)) {
      setSubmited(true);
      console.log("Contraseña restablecida con éxito.");
    } else {
      setError(reduxErrorMessage);
    }
  };

  return (
    <div className="reset-password-container w-100 m-auto h-80 flex flex-col items-center justify-center gap-7">
      <h2 className="text-xl">Restablecer Contraseña</h2>
      {!submited && (
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Nueva Contraseña</label>
            <input
              className="border p-2 rounded-lg w-full mb-5"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              className="border p-2 rounded-lg w-full"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message text-red-600">{error}</p>}

          <button
            className="mt-12 bg-main-blue text-white px-5 py-2 border rounded-full"
            type="submit"
          >
            Restablecer Contraseña
          </button>
        </form>
      )}
      {submited && (
        <div className="ease-out duration-500 flex flex-col items-center gap-20">
          <p className="p-8 bg-slate-200 rounded-lg">
            Su contraseña fue reestablecida con exito
          </p>
          <a
            href="/login"
            className="px-3 text-main-blue border-b-2 border-white hover:border-main-blue ease-out duration-500 "
          >
            Volver al login
          </a>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordUpdate;
