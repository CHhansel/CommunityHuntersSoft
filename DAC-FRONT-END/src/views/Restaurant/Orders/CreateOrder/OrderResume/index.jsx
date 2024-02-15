import React, { useEffect, useState } from "react";
import FormattedCurrency from "../../../../../components/NumberFormat";
import delete_icon from "../../../../../assets/delete-icon.svg";
import OrderProductItem from "../../../../../components/OrderProduct";
import { useFetchRestaurantTables } from "../../../../../hooks/tables/fetchRestaurantTables";

const OrderResume = ({ products, orderDetails, removeProductFromOrder }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null); // Estado para almacenar la mesa seleccionada
  const [selectedOrderType, setSelectedOrderType] = useState(""); // Estado para almacenar el tipo de orden seleccionado

  const company_id = 1; // Asumiendo que tienes un company_id definido, ajusta según tu implementación
  const { tablesData, isLoading, error } = useFetchRestaurantTables(
    company_id,
    reloadTrigger
  );
  // Lista de productos con detalles completos basados en orderDetails
  const detailedProducts = orderDetails.products.map((orderProduct) => {
    const productDetails = products.find(
      (product) => product.id === orderProduct.id
    );
    return {
      ...orderProduct,
      ...productDetails,
    };
  });
  console.log(tablesData);
  // Calcula el total de los precios cada vez que cambian los productos en la orden
  useEffect(() => {
    const calculateTotalPrice = () => {
      return detailedProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    };

    setTotalPrice(calculateTotalPrice());
  }, [detailedProducts]); // Dependencia actualizada a detailedProducts
  const handleTableSelect = (event) => {
    setSelectedTable(event.target.value); // Almacena el ID de la mesa seleccionada
  };
  // Manejar cambio en la selección del tipo de orden
  const handleOrderTypeSelect = (event) => {
    setSelectedOrderType(event.target.value); // Almacena el tipo de orden seleccionado
  };
  return (
    <div className="p-8 my-5 rounded-main bg-white border shadow">
      <div className="flex flex-row gap-5 mb-10">
        <div className="flex flex-col gap-3 ">
          <label htmlFor="">Seleccionar Mesa</label>
          <select
            className="input-text-sm"
            value={selectedTable}
            onChange={handleTableSelect}
          >
            <option value="">Seleccionar Mesa</option>
            {tablesData.tables.map((table) => (
              <option key={table.id} value={table.id} className="m-5">
                {table.number}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3 ">
        <label htmlFor="">Tipo De Orden</label>
        <select
          className="input-text-sm"
          value={selectedOrderType}
          onChange={handleOrderTypeSelect}
        >
          <option value="">Tipo de Orden</option>
          <option value="1">Express</option>
          <option value="2">Para Llevar</option>
          <option value="3">Comer Acá</option>
        </select>
      </div>
      </div>
      <h2>Productos en la orden:</h2>
      <ul>
        <li className="border rounded-main p-3 my-2">
          <div className="flex justify-between items-center">
            <p className="w-3/6 text-xs font-semibold">Plato</p>
            <p className="w-1/6 text-xs font-semibold">Precio</p>
            <p className="w-1/6 text-xs font-semibold text-center">Remover</p>
            <p className="w-1/6 text-xs font-semibold text-center">Notas</p>
          </div>
        </li>
        {detailedProducts.map((product, index) => (
          <OrderProductItem
            key={index}
            product={product}
            removeProductFromOrder={removeProductFromOrder}
          />
        ))}
      </ul>
      {/* Mostrar el total de precios */}
      <div className="flex justify-end">
        <p>Total:</p>
        <FormattedCurrency amount={totalPrice} />
      </div>
    </div>
  );
};

export default OrderResume;
