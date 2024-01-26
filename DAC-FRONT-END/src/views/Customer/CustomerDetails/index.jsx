import { useEffect, useState } from "react";
import { ProvinceSelect } from "../../../components/inputs/Select/ProvinceSelect";
import { CantonSelect } from "../../../components/inputs/Select/CantonSelect";
import { DistrictSelect } from "../../../components/inputs/Select/DistrictSelect";
import { DniTypeSelect } from "../../../components/inputs/Select/DniSelect";
import { useDeleteCustomer } from "../../../hooks/customers/useDeleteCustomer";
import Swal from "sweetalert2";
import { useAlert } from "../../../components/Notifications/MySwalNotification";
import { useUpdateCustomer } from "../../../hooks/customers/useUpdateCustomer";

// eslint-disable-next-line react/prop-types
export const CustomerDetails = ({ fila, updateTable }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState(fila);
  const { updateCustomer, isLoading, error } = useUpdateCustomer();
  const {
    deleteCustomer,
    isLoading: isLoadingDelete,
    error: errorDelete,
  } = useDeleteCustomer();

  const showToast = useAlert();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    setIsEditable(false);
    setFormData(fila);
  }, [fila]);

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleCancelEdit = () => {
    setIsEditable(false);
    setFormData(fila);
  };

  const handleDelete = async () => {
    setIsEditable(false);
    setFormData(fila);
    const result = await Swal.fire({
      title: "Desea borrar este Cliente?",
      text: "Esta acción no es reversible!",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        await deleteCustomer(formData.customer_id);
        console.log("Cliente eliminado con éxito");
        showToast("success", "Cliente Borrado con éxito!");
        updateTable();
      } catch (err) {
        console.error("Error al eliminar el Cliente:", err);
      }
    }
  };

  const handleSave = async () => {
    const result = await Swal.fire({
      title: "Desea actualizar este cliente?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });

    if (result.isConfirmed) {
      try {
        // Intenta actualizar el cliente y espera la respuesta
        await updateCustomer(formData);
        // Si la actualización es exitosa, muestra un mensaje de éxito
        showToast("success", "Cliente Actualizado con éxito!");
        // Aquí podrías llamar a updateTable() si todo fue bien
        updateTable();
      } catch (error) {
        // Si hay un error durante la actualización, muestra un mensaje de error
        console.error("Hubo un error al actualizar el cliente:", error);
        showToast(
          "warning",
          "Error al actualizar cliente. Por favor, inténtalo de nuevo."
        );
      }
    }

    setIsEditable(false);
  };

  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">Detalles</h2>
      <form className="flex justify-between flex-wrap items-start gap-5 w-full">
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="name">
            Nombre:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`input-text `}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="lastname">
            Apellido:
          </label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`input-text `}
          />
        </div>
        <DniTypeSelect
          value={formData.dni_type_id}
          onChange={handleInputChange}
          isEditable={isEditable}
        ></DniTypeSelect>
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="dni">
            Identificación:
          </label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`input-text`}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="email">
            Correo:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`input-text `}
          />
        </div>
        <div className="flex gap-5 flex-wrap">
          <ProvinceSelect
            value={formData.province}
            onChange={handleInputChange}
            isEditable={isEditable}
          ></ProvinceSelect>
          <CantonSelect
            formData={formData}
            onChange={handleInputChange}
            isEditable={isEditable}
          ></CantonSelect>
          <DistrictSelect
            formData={formData}
            onChange={handleInputChange}
            isEditable={isEditable}
          ></DistrictSelect>
          <div className="flex flex-col gap-3 ">
            <label className="text-xl" htmlFor="exact_address">
              Dirección Exacta:
            </label>
            <textarea
              className={`input-text `}
              name="exact_address"
              value={formData.exact_address}
              onChange={handleInputChange}
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xl" htmlFor="note">
            Nota:
          </label>
          <textarea
            className={`input-text `}
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            disabled={!isEditable}
          />
        </div>
      </form>
      <div className="flex justify-end gap-8 mt-5">
        {!isEditable ? (
          <button onClick={handleEdit} className="button-success">
            Editar
          </button>
        ) : (
          <div>
            <button onClick={handleDelete} className="button-delete">
              Borrar
            </button>
            <button onClick={handleCancelEdit} className="button-cancel">
              Cancelar
            </button>
            <button onClick={handleSave} className="button-success">
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
