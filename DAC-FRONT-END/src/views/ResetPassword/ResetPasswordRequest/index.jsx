import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestPasswordRecovery,
  selectStatus,
  selectErrorMessage,
} from "../../../store/authSlice/index";

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [submited, setSubmited] = useState(false);
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const errorMessage = useSelector(selectErrorMessage);

  const handleSubmit = async () => {
    dispatch(requestPasswordRecovery(email));
    setSubmited(true);
  };

  return (
    <div className="password-recovery-container  w-100 m-auto h-80 flex flex-col items-center justify-center gap-7">
      <h2 className="text-xl">Recuperación de Contraseña</h2>
      {!submited && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-9"
        >
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              className="border p-2 rounded-lg w-full"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="mt-12 bg-main-blue text-white px-5 py-2 border rounded-full"
            type="submit"
          >
            Solicitar Recuperación
          </button>
        </form>
      )}
      {submited && (
        <div className="flex flex-col items-center gap-20">
          <p className="p-8 bg-slate-200 rounded-lg">
            Si su correo existe se le enviará un email con los pasos para
            reestablecer su contraseña
          </p>
          <a
            href="/login"
            className="px-3 text-main-blue border-b-2 border-white hover:border-main-blue ease-out duration-500 "
          >
            Volver al login
          </a>
        </div>
      )}
      {status === "recovery-failed" && (
        <p className="error-message text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default ResetPasswordRequest;
