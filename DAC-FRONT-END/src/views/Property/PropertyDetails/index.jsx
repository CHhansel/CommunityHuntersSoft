import { useEffect, useState } from "react";
import { selectUser } from "../../../store/authSlice";
import { useSelector } from "react-redux";
import { ContractDetail } from "../ContractDetails";
import { ContractCreate } from "../ContractCreate";
import { propertyModuleCabys } from "../../../utils/cabysByModule";

import { ProvinceSelect } from "../../../components/inputs/Select/ProvinceSelect";
import { CantonSelect } from "../../../components/inputs/Select/CantonSelect";
import { DistrictSelect } from "../../../components/inputs/Select/DistrictSelect";
import { useUpdateProperty } from "../../../hooks/properties/useUpdateProperty";
import Swal from "sweetalert2";
import { useAlert } from "../../../components/Notifications/MySwalNotification";
import { useDeleteProperty } from "../../../hooks/properties/useDeleteProperty";

// eslint-disable-next-line react/prop-types
export const PropertyDetail = ({ fila, updateTable }) => {
  const { user } = useSelector(selectUser);
  const { updateProperty, isLoading: isLoadingUpdate, error: errorUpdate } = useUpdateProperty();
  const { deleteProperty, isLoading: isLoadingDelete, error: errorDelete } = useDeleteProperty();
  
  const [isEditable, setIsEditable] = useState(false);
  const showToast = useAlert();
  // eslint-disable-next-line react/prop-types
  const existContract = fila.state == "Ocupado" ? true : false;

  const [formData, setFormData] = useState({ ...fila });

  const [contratoViewActive, setcontratoViewActive] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

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
  useEffect(() => {
    setIsEditable(false);
    setcontratoViewActive(false);
    setFormData({ ...fila, user_id: user.id });
  }, [fila, user.id]);

  const handleEdit = () => {
    setIsEditable(true);
  };
  const handleCancelEdit = () => {
    setIsEditable(false);
    setFormData(fila);
  };

  const handleDelete = async () => {
    // Muestra el SweetAlert y espera a que el usuario confirme
    if(formData.state !== 'Disponible'){
      console.log("holaa");
      showToast("warning", "La propiedad tiene un contrato vigente, debe terminarlo primero!");
      return
    }
    const result = await Swal.fire({
      title: "Desea borrar esta propiedad?",
      text: "Esta acción no es reversible!",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        await deleteProperty(formData.product_id);
        console.log("Propiedad eliminada con éxito");
        showToast("success", "Propiedad Borrada con éxito!");
        updateTable();
      } catch (err) {
        console.error("Error al eliminar la propiedad:", err);
      }
    }
  };
  const handleSave = async () => {
    // Muestra el SweetAlert y espera a que el usuario confirme
    const result = await Swal.fire({
      title: "Desea actualizar esta propiedad?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        await updateProperty(formData);
        showToast("success", "Propiedad Actualizada con éxito!");
        updateTable();
      } catch (err) {
        console.error("Hubo un error al actualizar la propiedad:", err);
        alert("Error al actualizar propiedad. Por favor, inténtalo de nuevo.");
      }
    }
    setIsEditable(false);
  };
  console.log(formData);
  return (
    <div>
      <div className="p-10 my-5 rounded-main bg-white border shadow">
        <h2 className="text-2xl text-main-blue mb-8">Detalles</h2>
        <form className="flex justify-between flex-wrap items-start gap-5 w-full">
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
              disabled={!isEditable}
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
              disabled={!isEditable}
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
              disabled={!isEditable}
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
              disabled={!isEditable}
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
              disabled={!isEditable}
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
              disabled={!isEditable}
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
              disabled={!isEditable}
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
              disabled={!isEditable}
            />
          </div>
          <ProvinceSelect
            value={formData.province}
            onChange={handleChange}
            isEditable={isEditable}
          ></ProvinceSelect>
          <CantonSelect
            formData={formData}
            onChange={handleChange}
            isEditable={isEditable}
          ></CantonSelect>
          <DistrictSelect
            formData={formData}
            onChange={handleChange}
            isEditable={isEditable}
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
              disabled={!isEditable}
            />
          </div>
        </form>
        <div className="flex justify-end gap-8 mt-5">
          {!isEditable ? (
            <div>
              <button
                onClick={() => setcontratoViewActive(true)}
                className="bg-black  text-white px-5 py-2 border rounded-full mr-5"
              >
                {formData.state == "Ocupado"
                  ? "Ver Contrato"
                  : "Crear Contrato"}
              </button>
              <button
                onClick={handleEdit}
                className="bg-main-blue text-white px-5 py-2 border rounded-full"
              >
                Editar
              </button>
            </div>
          ) : (
            <div className="">
              <button onClick={handleDelete} className="button-delete">
                Borrar
              </button>
              <button onClick={handleCancelEdit} className=" button-cancel">
                Cancelar
              </button>
              <button onClick={handleSave} className="button-success">
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>

      {existContract && contratoViewActive && (
        <ContractDetail propiedad={formData} updateTable={updateTable} />
      )}
      {!existContract && contratoViewActive && (
        <ContractCreate propiedad={formData} updateTable={updateTable} />
      )}
    </div>
  );
};
