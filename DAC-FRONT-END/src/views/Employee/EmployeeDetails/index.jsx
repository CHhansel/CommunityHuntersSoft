import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployee } from "../../../actions/employee"; // Asegúrate de que esta ruta sea la correcta para tu configuración
import { selectUser } from "../../../store/authSlice";
import { fetchRoles } from "../../../actions/roles";
import useUpdateEmployee from "../../../hooks/employees/useUpdateEmployee";

// eslint-disable-next-line react/prop-types
export const EmployeeDetails = ({ fila }) => {
  const { user, token } = useSelector(selectUser);
  const [isEditable, setIsEditable] = useState(false);
  const { updateEmployee, isLoading, error } = useUpdateEmployee();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ ...fila, user_id: user.id });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    setIsEditable(false);
    setFormData({ ...fila, user_id: user.id });
  }, [fila, user.id]);
  const totalRoles = useSelector((state) => state.roles.totalRoles);
  useEffect(() => {
    dispatch(
      fetchRoles({
        id: user.id,
        page: 1,
        itemsPerPage: 10,
        token,
      })
    );
  }, [dispatch, user.id, token, totalRoles]);
  const roles = useSelector((state) => state.roles.roles);
  const handleSave = () => {
    try {
      dispatch(updateEmployee({ data: formData, token }));
      alert("Empleado actualizado con éxito!");
    } catch (error) {
      console.error("Hubo un error al crear el empleado:", error);
      alert("Error al crear empleado. Por favor, inténtalo de nuevo.");
    }
  };
  const handleEdit = () => {
    setIsEditable(true);
  };
  const handleCancelEdit = () => {
    setIsEditable(false);
    setFormData(fila);
  };
  const handleDelete = () => {
    setIsEditable(false);
    setFormData(fila);
  };
  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">Editar Empleado</h2>
      <form className="flex justify-between flex-wrap items-start gap-5 w-full">
        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="user_name">
              Usuario:
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              disabled={!isEditable}
              onChange={handleInputChange}
              className={`input-text`}
            />
          </div>
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={!isEditable}
              onChange={handleInputChange}
              className={`input-text`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="role_id">
              Rol:
            </label>
            <select
              name="role_id"
              value={formData.role_id}
              disabled={!isEditable}
              onChange={handleInputChange}
              className={`input-text`}
            >
              <option value="" disabled>
                Elige un rol
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}{" "}
   
                </option>
              ))}
            </select>
          </div>

        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="employee_name">
              Nombre:
            </label>
            <input
              type="text"
              name="employee_name"
              value={formData.employee_name}
              disabled={!isEditable}
              onChange={handleInputChange}
              className={`input-text `}
            />
          </div>
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="employee_lastname">
              Apellido:
            </label>
            <input
              type="text"
              name="employee_lastname"
              value={formData.employee_lastname}
              disabled={!isEditable}
              onChange={handleInputChange}
              className={`input-text `}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="phone_number">
            Número de Teléfono:
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            disabled={!isEditable}
            onChange={handleInputChange}
            className={`input-text `}
          />
        </div>
        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="salary">
            Salario:
          </label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            disabled={!isEditable}
            onChange={handleInputChange}
            className={`input-text `}
          />
        </div>
        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="province">
              Provincia:
            </label>
            <input
              type="text"
              name="province"
              value={formData.province}
              disabled={!isEditable}
              onChange={handleInputChange}
              className={`input-text `}
            />
          </div>
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="canton">
              Cantón:
            </label>
            <input
              type="text"
              name="canton"
              value={formData.canton}
              disabled={!isEditable}
              onChange={handleInputChange}
              className={`input-text `}
            />
          </div>
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="district">
              Distrito:
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              disabled={!isEditable}
              onChange={handleInputChange}
              className={`input-text `}
            />
          </div>
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="exact_address">
              Dirección Exacta:
            </label>
            <textarea
              name="exact_address"
              value={formData.exact_address}
              disabled={!isEditable}
              onChange={handleInputChange}
              className={`input-text `}
            />
          </div>
        </div>
      </form>
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex justify-end gap-8">
        {!isEditable ? (
          <div>
            <button
              onClick={handleEdit}
              className="bg-main-blue text-white px-5 py-2 border rounded-full"
            >
              Editar
            </button>
          </div>
        ) : (
          <div className="">
            <button
              onClick={handleDelete}
              className="bg-main-red  text-white px-5 py-2 border rounded-full"
            >
              Borrar
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-slate-400 mx-5 text-white px-5 py-2 border rounded-full"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-main-blue text-white px-5 py-2 border rounded-full"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
