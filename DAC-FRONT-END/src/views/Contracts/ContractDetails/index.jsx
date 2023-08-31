import { useEffect, useState } from "react";

export const ContractDetails = ({ fila }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState(fila);

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

  const handleDelete = () => {
    setIsEditable(false);
    setFormData(fila);
  };

  const handleSave = () => {
    // Aquí puedes hacer la llamada a la API para actualizar los datos
    setIsEditable(false);
  };

  return (
    <div className="">
      <form className="m-5 flex justify-evenly flex-wrap items-start gap-y-5">
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="contract_id">
            ID del Contrato:
          </label>
          <input
            type="text"
            name="contract_id"
            value={formData.contract_id}
            disabled
            className="border p-2 rounded-lg w-full border-white"
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="start_date">
            Fecha de Inicio:
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="end_date">
            Fecha de Finalización:
          </label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="rent_amount">
            Monto del Alquiler:
          </label>
          <input
            type="number"
            name="rent_amount"
            value={formData.rent_amount}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="tax_amount">
            Monto de Impuesto:
          </label>
          <input
            type="number"
            name="tax_amount"
            value={formData.tax_amount}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="payment_method">
            Método de Pago:
          </label>
          <input
            type="text"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="deposit_amount">
            Monto del Depósito:
          </label>
          <input
            type="number"
            name="deposit_amount"
            value={formData.deposit_amount}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="payment_date">
            Fecha de Pago:
          </label>
          <input
            type="number"
            name="payment_date"
            value={formData.payment_date}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="active">
            Activo:
          </label>
          <select
            name="active"
            value={formData.active}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          >
            <option value={1}>Sí</option>
            <option value={0}>No</option>
          </select>
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="terms_and_conditions">
            Términos y Condiciones:
          </label>
          <textarea
            name="terms_and_conditions"
            value={formData.terms_and_conditions}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          ></textarea>
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="created_at">
            Fecha de Creación:
          </label>
          <input
            type="date"
            name="created_at"
            value={formData.created_at}
            disabled
            className="border p-2 rounded-lg w-full border-white"
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="customer_name">
            Nombre del Cliente:
          </label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="customer_lastname">
            Apellido del Cliente:
          </label>
          <input
            type="text"
            name="customer_lastname"
            value={formData.customer_lastname}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[400px]">
          <label className="text-xl" htmlFor="property_name">
            Nombre de la Propiedad:
          </label>
          <input
            type="text"
            name="property_name"
            value={formData.property_name}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "border-slate-400" : "border-white"
            }`}
          />
        </div>
      </form>
      <div className="flex justify-end gap-8">
        {!isEditable ? (
          <button
            onClick={handleEdit}
            className="bg-main-blue text-white px-5 py-2 border rounded-full"
          >
            Editar
          </button>
        ) : (
          <div>
            <button
              onClick={handleCancelEdit}
              className="bg-slate-400 text-white px-5 py-2 border rounded-full"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="bg-main-red mx-5 text-white px-5 py-2 border rounded-full"
            >
              Eliminar
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

export default ContractDetails;
