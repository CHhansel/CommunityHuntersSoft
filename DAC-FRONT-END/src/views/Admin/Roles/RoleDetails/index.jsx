import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "../../../../store/authSlice";
import {
  fetchAccessibleModulesByRoleId,
  updateRoleAction,
} from "../../../../actions/roles";
import { fetchEmployees } from "../../../../actions/employee";
import { TablaDinamica } from "../../../../components/Table";

// eslint-disable-next-line react/prop-types
export const RoleDetails = ({ fila }) => {
  const { user, token } = useSelector(selectUser);
  const [selectedModules, setSelectedModules] = useState([]);
  const [filaSeleccionada, setFilaSeleccionada] = useState();
  const [employeesWithRol, setemployeesWithRol] = useState([]);
  //const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({ ...fila, user_id: user.id });
  const dispatch = useDispatch();
  const roles = useSelector(
    (state) => state.modules.accessibleModules.accessModules
  );
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await dispatch(
          fetchAccessibleModulesByRoleId({ role_id: formData.id, token })
        );
        if (response.payload) {
          const moduleIds = response.payload.accessibleModules.map(
            (module) => module.id
          );
          setSelectedModules(moduleIds);
          setFormData((prevState) => ({
            ...prevState,
            moduleIds: moduleIds,
          }));
        }
      } catch (error) {
        console.error("Error al obtener módulos accesibles:", error);
      }
    };

    fetchModules();
  }, [dispatch, formData.id, token, fila]);
  const employees = useSelector((state) => state.employees.employees);

  const status = useSelector((state) => state.employees.status);

  useEffect(() => {
    dispatch(
      fetchEmployees({
        id: user.id,
        page: 1,
        itemsPerPage: 100,
        token,
      })
    );
    setemployeesWithRol(
      employees.filter((employee) => employee.role_id === formData.id)
    );
  }, [dispatch, user.id, token]);
  // Manejador para el cambio de los checkboxes
  const handleModuleChange = (e) => {
    const moduleId = parseInt(e.target.value, 10);
    let updatedModules;
    if (e.target.checked) {
      updatedModules = [...selectedModules, moduleId];
    } else {
      updatedModules = selectedModules.filter((id) => id !== moduleId);
    }
    setSelectedModules(updatedModules);
    setFormData((prevState) => ({
      ...prevState,
      moduleIds: updatedModules,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      moduleIds: selectedModules,
    }));
    try {
      dispatch(updateRoleAction({ data: formData, token }));
      alert("Rol actualizado con éxito!");
    } catch (error) {
      console.error("Hubo un error al actualizar el rol:", error);
      alert("Error al actualizar el rol. Por favor, inténtalo de nuevo.");
    }
  };
  const employeesWithRolResume = employeesWithRol.map((employee) => ({
    employee_name: employee.employee_name,
    employee_lastname: employee.employee_lastname,
    email: employee.email,
  }));

  return (
    <>
      {status == "succeeded" && (
        <div className="border border-black p-5 my-5">
          <h2 className="text-2xl text-main-blue mb-8">Detalles de Rol</h2>
          {employeesWithRol.length > 0 && (
            <div className="w-[500px] m-auto pb-5">
              <TablaDinamica
                datos={employeesWithRolResume}
                dataType="Employee"
                setFilaSeleccionada={setFilaSeleccionada}
              ></TablaDinamica>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="m-5 flex justify-evenly flex-wrap items-start gap-y-5"
          >
            
            <div className="flex flex-col gap-3 w-[400px]">
              <label className="text-xl " htmlFor="name">
                Nombre
              </label>
              <input
                className="border p-2 rounded-lg w-full"
                type="text"
                name="name"
                placeholder="Nombre de el rol"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-3 w-[400px]">
              <label className="text-xl">Módulos</label>

              {roles.map((role) => (
                <label key={role.module_id}>
                  <input
                    type="checkbox"
                    value={role.module_id}
                    checked={selectedModules.includes(role.module_id)}
                    onChange={handleModuleChange}
                  />
                  {role.module_name}
                </label>
              ))}
            </div>
          </form>
          <div className="w-full flex justify-end">
            <button
              onClick={handleSubmit}
              className="mt-12 bg-main-blue text-white px-5 py-2 border rounded-full"
              type="submit"
            >
              Editar Rol
            </button>
          </div>
        </div>
      )}
    </>
  );
};
