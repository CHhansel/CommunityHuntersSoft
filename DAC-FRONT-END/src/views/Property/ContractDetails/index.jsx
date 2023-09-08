import { useEffect, useState } from "react";
import { updatePropertyContractAction } from "../../../actions/properties";
import { selectUser } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
export const ContractDetail = ({ propiedad }) => {
  const { user, token } = useSelector(selectUser);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({ ...propiedad, user_id: user.id });
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    setIsEditable(false);
    setFormData(propiedad);
  }, [propiedad]);

  const handleEdit = () => {
    setIsEditable(true);
  };
  const handleCancelEdit = () => {
    setIsEditable(false);
    setFormData(propiedad);
  };
  const handleDelete = () => {
    setIsEditable(false);
    setFormData(propiedad);
  };
  const handleSave = () => {
  
    try {
      dispatch(updatePropertyContractAction({ data: formData, token }));
      alert("Propiedad creada con éxito!");
    } catch (error) {
      console.error("Hubo un error al crear la propiedad:", error);
      alert("Error al crear propiedad. Por favor, inténtalo de nuevo.");
    }

    setIsEditable(false);
  };
  console.log(propiedad);
  return (
    <div className="border border-black p-5 my-5">
      <h2 className="text-2xl text-main-blue mb-8">Ver Contrato de Propiedad</h2>
      <form className="m-5 flex justify-evenly flex-wrap items-start gap-y-5">
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="customer_id">
            Cliente id:
          </label>
          <input
            type="text"
            name="customer_id"
            value={formData.customer_id}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "  border-slate-400" : " "
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="payment_date">
            Fecha de pago:
          </label>
          <input
            type="text"
            name="payment_date"
            value={formData.payment_date}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full ${
              isEditable ? "  border-slate-400" : " "
            }`}
          />
        </div>
        <div className="flex flex-col gap-3 w-[300px]">
          <label className="text-xl" htmlFor="payment_method">
            Metodo de Pago:
          </label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={`border p-2 rounded-lg w-full disabled:text-black disabled:opacity-100 ${
              isEditable
                ? "bg-white  border-slate-400"
                : "bg-input border-white "
            }`}
          >
            <option value="1">Sinpe</option>
            <option value="2">Transacción</option>
            <option value="3">Efectivo</option>
          </select>
        </div>
        <div className="w-full flex justify-center gap-5">
          <div className="flex flex-col gap-3 w-[200px]">
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
                isEditable ? "  border-slate-400" : " "
              }`}
            />
          </div>
          <div className="flex flex-col gap-3 w-[200px]">
            <label className="text-xl" htmlFor="end_date">
              Fecha de Fín:
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`border p-2 rounded-lg w-full ${
                isEditable ? "  border-slate-400" : " "
              }`}
            />
          </div>
        </div>

        <div className="flex gap-5 mt-5">
        <div className="flex flex-col gap-3 w-[200px]">
            <label className="text-xl" htmlFor="deposit_amount">
              Deposito:
            </label>
            <input
              type="number"
              name="deposit_amount"
              value={formData.deposit_amount}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
          <div className="flex flex-col gap-3 w-[200px]">
            <label className="text-xl" htmlFor="rent_amount">
              Monto de renta:
            </label>
            <input
              type="number"
              name="rent_amount"
              value={formData.rent_amount}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`border p-2 rounded-lg w-full ${
                isEditable ? "  border-slate-400" : " "
              }`}
            />
          </div>
          <div className="flex flex-col gap-3 w-[200px]">
            <label className="text-xl" htmlFor="tax_amount">
              Monto de tax:
            </label>
            <input
              type="number"
              name="tax_amount"
              value={formData.tax_amount}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`border p-2 rounded-lg w-full ${
                isEditable ? "  border-slate-400" : " "
              }`}
            />
          </div>
          <div className="flex flex-col gap-3 w-[200px]">
            <label className="text-xl" htmlFor="total_amount">
              Monto de total:
            </label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleInputChange}
              disabled={!isEditable}
              className={`border p-2 rounded-lg w-full ${
                isEditable ? "  border-slate-400" : " "
              }`}
            />
          </div>
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
