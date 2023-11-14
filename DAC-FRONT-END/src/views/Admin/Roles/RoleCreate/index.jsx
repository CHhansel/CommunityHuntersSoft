import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import { selectUser } from "../../../../store/authSlice";
import { createRoleAction } from "../../../../actions/roles";



export const RoleCreate = () => {
  const { user, token } = useSelector(selectUser);
  const [selectedModules, setSelectedModules] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    moduleIds: selectedModules,
    user_id: user.id
  });
  const roles = useSelector((state) => state.modules.accessibleModules.accessModules);

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

  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  formData.province;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      moduleIds: selectedModules,
    }));
    try {
      dispatch(createRoleAction({ data: formData, token }));
      alert("Rol creada con éxito!");
    } catch (error) {
      console.error("Hubo un error al crear el rol:", error);
      alert("Error al crear el rol. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="border border-black p-5 my-5">
      <h2 className="text-2xl text-main-blue mb-8">Crear Rol</h2>

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
            Crear Rol
          </button>
        </div>
    </div>
  );
};
