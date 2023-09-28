import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee } from "../../../actions/employee"; // Asegúrate de que esta ruta sea la correcta para tu configuración
import { selectUser } from "../../../store/authSlice";

export const EmployeeCreate = () => {
  const { user, token } = useSelector(selectUser);

  const [error, setError] = useState(null); // Estado para manejar errores

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    company_name: "",
    user_name: "",
    email: "",
    role_id: "",
    password: "",
    employee_name: "",
    employee_lastname: "",
    phone_number: "",
    salary: "",
    province: "",
    canton: "",
    district: "",
    exact_address: "",
    client_id: user.id,
    user_id: user.id,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      dispatch(createEmployee({ data: formData, token }));
      alert("Empleado creado con éxito!");
    } catch (error) {
      console.error("Hubo un error al crear el empleado:", error);
      alert("Error al crear empleado. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="border border-black p-5 my-5">
      <h2 className="text-2xl text-main-blue mb-8">Crear Empleado</h2>
      <form className="m-5 flex flex-col justify-evenly gap-8 flex-wrap items-start">
        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="company_name">
              Nombre de la Compañía:
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="user_name">
              Nombre de Usuario:
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="role_id">
              ID del Rol:
            </label>
            <input
              type="number"
              name="role_id"
              value={formData.role_id}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
        </div>
        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="password">
              Contraseña:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>

          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="confirmPassword">
              Repita Contraseña:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
        </div>
        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="employee_name">
              Nombre:
            </label>
            <input
              type="text"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="employee_lastname">
              Apellido:
            </label>
            <input
              type="text"
              name="employee_lastname"
              value={formData.employee_lastname}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="phone_number">
            Número de Teléfono:
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className={`border p-2 rounded-lg w-full `}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="salary">
            Salario:
          </label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            className={`border p-2 rounded-lg w-full `}
          />
        </div>
        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="province">
              Provincia:
            </label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="canton">
              Cantón:
            </label>
            <input
              type="text"
              name="canton"
              value={formData.canton}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="district">
              Distrito:
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
          <div className="flex flex-col gap-3 w-[300px]">
            <label className="text-xl" htmlFor="exact_address">
              Dirección Exacta:
            </label>
            <textarea
              name="exact_address"
              value={formData.exact_address}
              onChange={handleInputChange}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
        </div>
      </form>
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex justify-end gap-8">
        <button
          onClick={handleSave}
          className="bg-main-blue text-white px-5 py-2 border rounded-full"
        >
          Crear
        </button>
      </div>
    </div>
  );
};
