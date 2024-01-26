import { useState } from "react";

import { selectUser } from "../../../store/authSlice";
import { ProvinceSelect } from "../../../components/inputs/Select/ProvinceSelect";
import { CantonSelect } from "../../../components/inputs/Select/CantonSelect";
import { DistrictSelect } from "../../../components/inputs/Select/DistrictSelect";
import { useSelector } from "react-redux";
import { useCreateEmployee } from "../../../hooks/employees/useCreateEmployee";
import { useAlert } from "../../../components/Notifications/MySwalNotification";
import Swal from "sweetalert2";

export const EmployeeCreate = () => {
  const { user, token } = useSelector(selectUser);

  const showToast = useAlert();

  const { createEmployee, isLoading, error } = useCreateEmployee(); // Utiliza el hook

  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    role_id: "2",
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
    company_id: user.company_id,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    const result = await Swal.fire({
      title: "Desea crear este cliente?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        // Llama al método createEmployee del hook
        await createEmployee(formData);
        alert("Empleado creado con éxito!");
      } catch (err) {
        console.error("Hubo un error al crear el empleado:", err);
        alert("Error al crear empleado. Por favor, inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">Crear Empleado</h2>
      <form className="flex justify-between flex-wrap items-start gap-5 w-full">
        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="user_name">
              Nombre de Usuario:
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              className={`input-text `}
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
              onChange={handleInputChange}
              className={`input-text `}
            />
          </div>
        </div>
        <div className="flex gap-5 flex-wrap">
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="password">
              Contraseña:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input-text `}
            />
          </div>

          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="confirmPassword">
              Repita Contraseña:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`input-text `}
            />
          </div>
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
            onChange={handleInputChange}
            className={`input-text `}
          />
        </div>
        <div className="flex gap-5 flex-wrap">
          <ProvinceSelect
            value={formData.province}
            onChange={handleInputChange}
          ></ProvinceSelect>
          <CantonSelect
            formData={formData}
            onChange={handleInputChange}
          ></CantonSelect>
          <DistrictSelect
            formData={formData}
            onChange={handleInputChange}
          ></DistrictSelect>
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="exact_address">
              Dirección Exacta:
            </label>
            <textarea
              name="exact_address"
              value={formData.exact_address}
              onChange={handleInputChange}
              className={`input-text `}
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
