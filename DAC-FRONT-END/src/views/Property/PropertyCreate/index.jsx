import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";

import { useCreateProperty } from "../../../hooks/properties/useCreateProperty";
import { propertyModuleCabys } from "../../../utils/cabysByModule";
import { ProvinceSelect } from "../../../components/inputs/Select/ProvinceSelect";
import { CantonSelect } from "../../../components/inputs/Select/CantonSelect";
import { DistrictSelect } from "../../../components/inputs/Select/DistrictSelect";
import { useAlert } from "../../../components/Notifications/MySwalNotification";
import Swal from "sweetalert2";

// eslint-disable-next-line react/prop-types
export const PropertyCreate = ({ updateTable }) => {
  const { user } = useSelector(selectUser);
  const { createProperty, isLoading, error } = useCreateProperty();
  const showToast = useAlert();
  const [formData, setFormData] = useState({
    internal_code: "",
    name: "",
    description: "",
    price: "",
    quantity: "1",
    cabys_code: "",
    unit_of_measure: "Alc",
    tax_rate: "",
    company_id: user.company_id, 
    tax_included: true, 
    exact_address: "",
    province_code: "1", 
    canton_code: "",
    district_code: "",
    state: "Disponible", 
    antiquity: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleCabys = (e) => {
    const { value } = e.target;

    // Encuentra el elemento Cabys seleccionado
    const selectedCabys = propertyModuleCabys.find(
      (item) => item.code === value
    );

    if (selectedCabys) {
      setFormData((prevState) => ({
        ...prevState,
        cabys_code: selectedCabys.code,
        tax_rate: selectedCabys.tax, // Establece el tax_rate basado en la selección
      }));
    } else {
      // En caso de que se seleccione la opción "Seleccione un Código Cabys"
      setFormData((prevState) => ({
        ...prevState,
        cabys_code: "",
        tax_rate: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Muestra el SweetAlert y espera a que el usuario confirme
    const result = await Swal.fire({
      title: "Desea crear esta propiedad?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
  
    if (result.isConfirmed) {
      // El usuario confirmó, procede a guardar
      try {
        await createProperty(formData);
        showToast("success", "Propiedad creada con éxito!");
        updateTable();
      } catch (err) {
        console.error("Hubo un error al crear la propiedad:", err);
        alert("Error al crear propiedad. Por favor, inténtalo de nuevo.");
      }
    } else if (result.isDenied) {
      // El usuario no confirmó, muestra un mensaje
      Swal.fire("Changes are not saved", "", "info");
    }
  };
  

  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">Crear Propiedad</h2>

      <form
        onSubmit={handleSubmit}
        className=" flex justify-between flex-wrap items-start gap-5 w-full"
      >
        <div className="flex flex-col gap-3">
          <label className="text-lg " htmlFor="internal_code">
            Código Interno
          </label>
          <input
            className="input-text"
            type="text"
            name="internal_code"
            placeholder="Código Interno"
            value={formData.internal_code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-lg " htmlFor="name">
            Nombre
          </label>
          <input
            className="input-text"
            type="text"
            name="name"
            placeholder="Nombre de la propiedad"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col  gap-3 ">
          <label className="text-lg" htmlFor="description">
            Descripción
          </label>
          <textarea
            className="input-text"
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-lg" htmlFor="state">
            Estado
          </label>
          <select
            className="input-text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="Disponible">Disponible</option>
            <option value="Ocupado">Ocupado</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-lg" htmlFor="unit_of_measure">
            Tipo de alquiler
          </label>
          <select
            className="input-text"
            name="unit_of_measure"
            value={formData.unit_of_measure}
            onChange={handleChange}
            required
          >
            <option value="Al">Alquiler de uso habitacional</option>
            <option value="Alc">Alquiler de uso comercial</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-lg" htmlFor="antiquity">
            Antigüedad:
          </label>
          <input
            type="date"
            name="antiquity"
            value={formData.antiquity}
            className="input-text"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-lg " htmlFor="cabys_code">
            Código Cabys
          </label>
          <select
            className="input-text"
            name="cabys_code"
            value={formData.cabys_code}
            onChange={handleCabys}
            required
          >
            <option value="">Seleccione un Código Cabys</option>
            {propertyModuleCabys.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} {item.description} - {item.tax}%
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="price">
            Precio:
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`input-text`}
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
        <div className="w-full flex justify-end">
          <button className="mt-12 button-success" type="submit">
            Crear Propiedad
          </button>
        </div>
      </form>
    </div>
  );
};
