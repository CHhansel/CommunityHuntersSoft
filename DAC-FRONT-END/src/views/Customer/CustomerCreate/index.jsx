import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import { DistrictSelect } from "../../../components/inputs/Select/DistrictSelect";
import { CantonSelect } from "../../../components/inputs/Select/CantonSelect";
import { ProvinceSelect } from "../../../components/inputs/Select/ProvinceSelect";
import { DniTypeSelect } from "../../../components/inputs/Select/DniSelect";
import useCreateCustomer from "../../../hooks/customers/useCreateCustomer";
import Swal from "sweetalert2";
import { useAlert } from "../../../components/Notifications/MySwalNotification";

export const CustomerCreate = ({updateTable}) => {
  const { user } = useSelector(selectUser);
  const showToast = useAlert();

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    dni: "",
    dni_type: 1,
    email: "",
    company_id: user.company_id,
    note: "",
    province_code: "1",
    canton_code: "",
    district_code: "",
    exact_address: "",
  });
  const { createCustomer, isLoading, error } = useCreateCustomer();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const result = await Swal.fire({
      title: "Desea crear este cliente?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });

    if (result.isConfirmed) {
      try {
        await createCustomer(formData);
        showToast("success", "Cliente creado con éxito!");
        updateTable();
      } catch (error) {
        console.error("Hubo un error al crear el cliente:", error);
        showToast(
          "warning",
          "Error al actualizar cliente. Por favor, inténtalo de nuevo."
        );      }
    }
  };

  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <form
        onSubmit={handleSubmit}
        className="flex justify-between flex-wrap items-start gap-5 w-full"
      >
        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="name">
            Nombre
          </label>
          <input
            className="input-text"
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="lastname">
            Apellido
          </label>
          <input
            className="input-text"
            type="text"
            name="lastname"
            placeholder="Apellido"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <DniTypeSelect
          value={formData.dni_type_id}
          onChange={handleChange}
        ></DniTypeSelect>
        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="dni">
            Identificación
          </label>
          <input
            className="input-text"
            type="text"
            name="dni"
            placeholder="Identificación"
            value={formData.dni}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="email">
            Correo
          </label>
          <input
            className="input-text"
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <ProvinceSelect
          value={formData.province}
          onChange={handleChange}
        ></ProvinceSelect>
        <CantonSelect
          formData={formData}
          onChange={handleChange}
        ></CantonSelect>
        <DistrictSelect
          formData={formData}
          onChange={handleChange}
        ></DistrictSelect>
        <div className="flex flex-col gap-3">
          <label className="text-lg " htmlFor="exact_address">
            Dirección exacta
          </label>
          <textarea
            className="input-text"
            name="exact_address"
            placeholder="Dirección exacta"
            value={formData.exact_address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3 ">
          <label className="text-xl" htmlFor="note">
            Nota
          </label>
          <textarea
            className="input-text"
            name="note"
            placeholder="Nota"
            value={formData.note}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="w-full flex justify-end">
          <button className="button-success" type="submit">
            Crear Cliente
          </button>
        </div>
      </form>
    </div>
  );
};
