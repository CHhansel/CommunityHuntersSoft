import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCreateRestaurantTable } from "../../../../hooks/tables/useCreateRestaurantTable";
import Button from "../../../../components/buttons/Button";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../store/authSlice";
import { useAlert } from "../../../../components/Notifications/MySwalNotification";
import { useDeleteTable } from "../../../../hooks/tables/useDeleteTable";
import { useUpdateTable } from "../../../../hooks/tables/useUpdateTable";

const RestaurantTableCreate = ({ onClose, onCreated, selectedTable }) => {
  const { user } = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const showToast = useAlert();
  const [tableData, setTableData] = useState(selectedTable);

  const { createRestaurantTable, isLoading, error } =
    useCreateRestaurantTable();
  const {
    updateTable,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateTable();
  const {
    deleteTableById,
    isLoading: isDeleting,
    error: deleteError,
  } = useDeleteTable();
  useEffect(() => {
    if (selectedTable == null) {
      setTableData({
        number: "",
        max_capacity: "",
        description: "",
        reserved: "Disponible",
        in_use: "Disponible",
        company_id: user.company_id,
      });
    } else {
      setTableData(selectedTable);
    }
    setLoading(false);
  }, [selectedTable]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Seguro que desea borrar esta mesa?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        await deleteTableById(selectedTable.id);
        showToast("success", "Mesa eliminada con éxito!");
        onCreated();
      } catch (err) {
        console.error("Error deleting restaurant table:", err);
      }
    }
  };
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "¿Desea guardar los cambios?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        await updateTable(selectedTable.id, tableData); // Utiliza updateTable para actualizar la mesa existente
        showToast("success", "Mesa actualizada con éxito!");
        onCreated();
      } catch (err) {
        console.error("Error updating restaurant table:", err);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "¿Desea crear esta mesa?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    });
    if (result.isConfirmed) {
      try {
        // Llama a createRestaurantTable con los datos de la mesa
        const response = await createRestaurantTable(tableData);
        showToast("success", "Mesa creada con éxito!");
        onCreated();
      } catch (err) {
        console.error("Error creating restaurant table:", err);
      }
    } else if (result.isDenied) {
      await Swal.fire("Los cambios no se guardaron", "", "info");
    }
  };
  if (loading) {
    return <div>Cargando</div>;
  }
  return (
    <div className="p-10 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">
        {selectedTable == null
          ? " Crear Mesa de Restaurante"
          : " Ver/Modificar Mesa de Restaurante"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex justify-start flex-wrap items-start gap-5 w-full"
      >
        <div className="flex flex-col gap-3 ">
          <label>Número de Mesa:</label>
          <input
            className="input-text"
            type="number"
            name="number"
            value={tableData.number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3 ">
          <label>Capacidad Máxima:</label>
          <input
            className="input-text"
            type="number"
            name="max_capacity"
            value={tableData.max_capacity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Descripción:</label>
          <textarea
            className="input-text"
            name="description"
            value={tableData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="flex flex-col gap-3">
          <label>¿Reservada?</label>
          <select
            className="input-text"
            name="reserved"
            value={tableData.reserved}
            onChange={handleChange}
            required
          >
            <option value={"Disponible"}>Disponible</option>
            <option value={"Reservada"}>Reservada</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label>¿En Uso?</label>
          <select
            className="input-text"
            name="in_use"
            value={tableData.in_use}
            onChange={handleChange}
            required
          >
            <option value={"Disponible"}>Disponible</option>
            <option value={"Ocupada"}>Ocupada</option>
          </select>
        </div>
        <div className="w-full flex justify-end">
          <Button type="CANCEL" onClick={onClose} />
          {selectedTable == null ? (
            <Button type="ADD" onClick={handleSubmit} text={"MESA"} />
          ) : (
            <>
              <Button type="DELETE" onClick={handleDelete} text={"MESA"} />
              <Button type="UPDATE" onClick={handleSubmitUpdate} text={"MESA"} />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default RestaurantTableCreate;
