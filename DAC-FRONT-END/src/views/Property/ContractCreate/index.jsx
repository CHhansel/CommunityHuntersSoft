import { useState } from "react";
import {
  updatePropertyContractAction,
} from "../../../actions/properties";
import { selectUser } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateContractFirstStep from "./CreateContractSelectClient";

// eslint-disable-next-line react/prop-types
export const ContractCreate = ({ propiedad }) => {
  const { user, token } = useSelector(selectUser);
  // const [formData, setFormData] = useState({ ...propiedad, user_id: user.id });
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    antiquity: "2023-05-01",
    customer_id: "",
    start_date: "",
    end_date: "",
    state: "Ocupado",
    deposit_amount: "",
    rent_amount: "",
    tax_amount: "",
    total_amount: "",
    payment_method: 1,
    payment_date: "",
    contract_file: "",
    province: "San Jose",
    exact_address: "",
    user_id: user.id,
    // eslint-disable-next-line react/prop-types
    Id: propiedad.Id
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log(formData);
    try {
      dispatch(updatePropertyContractAction({ data: formData, token }));
      alert("Propiedad creada con éxito!");
    } catch (error) {
      console.error("Hubo un error al crear la propiedad:", error);
      alert("Error al crear propiedad. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="border border-black p-5 my-5">
      <h2 className="text-2xl text-main-blue mb-8">
        Crear Contrato de Propiedad
      </h2>
      <CreateContractFirstStep
        setFormData={setFormData}
      ></CreateContractFirstStep>
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
            disabled={true}
            className={`border p-2 rounded-lg w-full `}
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
            className={`border p-2 rounded-lg w-full`}
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
            className={`border p-2 rounded-lg w-full disabled:text-black 
            disabled:opacity-100 `}
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
              className={`border p-2 rounded-lg w-full `}
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
              className={`border p-2 rounded-lg w-full `}
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
              className={`border p-2 rounded-lg w-full `}
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
              className={`border p-2 rounded-lg w-full `}
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
              className={`border p-2 rounded-lg w-full `}
            />
          </div>
        </div>
      </form>
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
