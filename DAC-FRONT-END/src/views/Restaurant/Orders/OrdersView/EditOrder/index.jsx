import React, { useState } from "react";
import { useFetchRestaurantTables } from "../../../../../hooks/tables/fetchRestaurantTables";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../store/authSlice";
import Button from "../../../../../components/buttons/Button";
import { useFetchProductsByOrderId } from "../../../../../hooks/orders/useFetchProductsByOrderId";
import { useNavigate } from "react-router-dom";
import { useFetchOrderWithProducts } from "../../../../../hooks/orders/useFetchOrderWithProducts ";

const EditOrder = ({ onClose, order }) => {
  const { user } = useSelector(selectUser);
  let navigate = useNavigate();

  const [editedOrder, setEditedOrder] = useState(order);
  const [selectedTable, setSelectedTable] = useState(null); // Estado para almacenar la mesa seleccionada

  const [reloadTrigger, setReloadTrigger] = useState(0);

  
  const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedOrder((prevOrder) => ({
          ...prevOrder,
          [name]: value,
        }));
    };
    const { products, loading, error } = useFetchProductsByOrderId(order.id); // Llama al hook y pasa el id de la orden
  const { orderWithProducts } = useFetchOrderWithProducts(order.id);
  const handleTableSelect = (event) => {
    setSelectedTable(event.target.value); // Almacena el ID de la mesa seleccionada
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar la orden editada a través de una función de actualización
    onClose(); // Cerrar el modal después de editar la orden
  };
  const renderStateOptions = () => {
    const stateOptions = ["Esperando", "En cocina", "Entregado", "Facturado"];

    return stateOptions.map((state, index) => (
      <option key={index} value={index}>
        {state}
      </option>
    ));
  };
  const handleEditProducts = ()=>{
    navigate(`/editar-orden/${order.id}`);

  }
  const { tablesData } = useFetchRestaurantTables(
    user.company_id,
    reloadTrigger
  );
  const renderTypeOptions = () => {
    const typeOptions = ["Para llevar", "Express", "Comer Aca"];

    return typeOptions.map((type, index) => (
      <option key={++index} value={type}>
        {type}
      </option>
    ));
  };
  return (
    <div className="p-10 rounded-main bg-white border shadow">
      <h2 className="text-2xl text-main-blue mb-8">
        Editar Orden #{editedOrder.order_number}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex justify-start flex-wrap items-start gap-5 w-full"
      >
        {editedOrder.type === 3 && (
          <div className="flex flex-col gap-3 ">
            <label htmlFor="">Mesa</label>
            <select
              className="input-text-sm"
              value={selectedTable}
              onChange={handleTableSelect}
            >
              <option value="">Mesas</option>
              {tablesData.tables.map((table) => (
                <option key={table.id} value={table.id} className="m-5">
                  {table.number}
                </option>
              ))}
            </select>
          </div>
        )}
        {/* Condicional para mostrar los campos según el tipo de orden */}
        {editedOrder.type === 1 && (
          <>
            <div className="flex flex-col gap-3">
              <label>Dirección del Cliente:</label>
              <input
                className="input-text"
                type="text"
                name="customer_address"
                value={editedOrder.customer_address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <label>Nombre del Cliente:</label>
              <input
                className="input-text"
                type="text"
                name="customer_name"
                value={editedOrder.customer_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <label>Teléfono del Cliente:</label>
              <input
                className="input-text"
                type="text"
                name="customer_phone"
                value={editedOrder.customer_phone}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        {editedOrder.type === 3 && (
          <div className="flex flex-col gap-3">
            <label>Beeper:</label>
            <input
              className="input-text"
              type="text"
              name="beeper_number"
              value={editedOrder.beeper_number}
              onChange={handleChange}
              required
            />
          </div>
        )}
        {/* Campos comunes a todas las órdenes */}
        <div className="flex flex-col gap-3">
          <label>Estado:</label>
          <select
            className="input-text"
            name="state"
            value={editedOrder.state}
            onChange={handleChange}
            required
          >
            {renderStateOptions()}
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label>Tipo de Orden:</label>
          <select
            className="input-text"
            name="type"
            value={editedOrder.type}
            onChange={handleChange}
            required
          >
            {renderTypeOptions()}
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label>Total:</label>
          <input
            className="input-text"
            type="number"
            name="total"
            value={editedOrder.total}
            onChange={handleChange}
            required
          />
        </div>
        {/* Botones de guardar y cancelar */}

      </form>
      <div className="flex flex-col gap-3">
          <label>Productos:</label>
          {loading ? (
            <div>Cargando productos...</div>
          ) : error ? (
            <div>Error al cargar productos</div>
          ) : (
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      <div className="flex justify-end">
      <Button type="UNDO" onClick={onClose} text="" />
      <Button type="UPDATE" onClick={handleEditProducts} text={"PRODUCTOS"} />
      <Button type="UPDATE" onClick={handleSubmit} text={"ORDEN"} />
      </div>
    </div>
  );
};

export default EditOrder;
