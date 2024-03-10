import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FormattedCurrency from "../../../../../components/NumberFormat";
import OrderProductItem from "../../../../../components/OrderProduct";
import { useFetchRestaurantTables } from "../../../../../hooks/tables/fetchRestaurantTables";
import useFetchEmployeesByModuleAndCompany from "../../../../../hooks/employees/useFetchEmployeeByModuleAndCompany";
import Button from "../../../../../components/buttons/Button";
import OrderFinalResume from "./OrderFinalResume";
import PopUp from "../../../../../components/popUp";
import useCreateOrder from "../../../../../hooks/orders/useCreateOrder";
import { useAlert } from "../../../../../components/Notifications/MySwalNotification";

const OrderResume = ({
  products,
  orderDetails,
  removeProductFromOrder,
  addCommentToProduct,
}) => {
  const showToast = useAlert();
  let navigate = useNavigate();
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [subtotalPrice, setSubtotalPrice] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null); // Estado para almacenar la mesa seleccionada
  const [selectedOrderType, setSelectedOrderType] = useState("3"); // Estado para almacenar el tipo de orden seleccionado
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { createOrder, isLoadingCreateOrder, errorCreateOrder } =
    useCreateOrder();
  const [orderCustomerInfo, setOrderCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [orderFinal, setOrderFinal] = useState({});
  const company_id = 1; // Asumiendo que tienes un company_id definido, ajusta según tu implementación
  const { tablesData, isLoading, error } = useFetchRestaurantTables(
    company_id,
    reloadTrigger
  );
  const {
    employeesData,
    loading: loadingEmployees,
    error: errorEmployees,
  } = useFetchEmployeesByModuleAndCompany(6, company_id, reloadTrigger);

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
  const togglePopUp = () => {
    setPopUpOpen((prev) => !prev);
  };
  useEffect(() => {
    const calculateTotals = () => {
      let subtotal = 0;
      let totalTax = 0;
      console.log(detailedProducts);
      detailedProducts.forEach((product) => {
        const productTotalPrice = product.price * 1;
        const productTax = (productTotalPrice * product.tax_rate) / 100; // Calcula el impuesto del producto
        subtotal += productTotalPrice - productTax; // Suma al subtotal el precio del producto sin impuestos
        totalTax += productTax; // Acumula el total de impuestos
      });

      let total = subtotal + totalTax; // Calcula el total incluyendo impuestos

      // Si selectedOrderType es "3", añade un 10% adicional al total
      if (selectedOrderType === "3") {
        total += total * 0.1;
      }

      return { subtotal, totalTax, total }; // Retorna ambos valores para usarlos posteriormente
    };

    const { subtotal, totalTax, total } = calculateTotals();
    setTotalPrice(total); // Ajusta según cómo quieras manejar el subtotal en tu estado/componente
    setTaxes(totalTax);
    setSubtotalPrice(subtotal);
  }, [detailedProducts, selectedOrderType]); // Añade selectedOrderType a las dependencias

  const handleTableSelect = (event) => {
    setSelectedTable(event.target.value); // Almacena el ID de la mesa seleccionada
  };
  // Manejar cambio en la selección del tipo de orden
  const handleOrderTypeSelect = (event) => {
    setSelectedOrderType(event.target.value); // Almacena el tipo de orden seleccionado
  };
  // Funciones manejadoras para actualizar el estado orderCustomerInfo
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setOrderCustomerInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleConfirmOrder = () => {
    if (selectedOrderType == 3 && selectedTable == null) {
      showToast("warning", "Seleccione una Mesa!");
      return;
    }
    if (selectedEmployee == null) {
      showToast("warning", "Seleccione un empleado!");
      return;
    }
    if (selectedOrderType == 1) {
      if (orderCustomerInfo.name == "") {
        showToast("warning", "Ingrese nombre de cliente!");
        return;
      }
      if (orderCustomerInfo.phone == "") {
        showToast("warning", "Ingrese teléfono de cliente!");
        return;
      }
      if (orderCustomerInfo.address == "") {
        showToast("warning", "Ingrese dirección de cliente!");
        return;
      }
    }
    if (detailedProducts.length <= 0) {
      showToast("warning", "La orden no posee productos!");
      return;
    }
    setOrderFinal({
      ...orderDetails,
      table: selectedTable,
      subtotalPrice,

      total: totalPrice,
      employee: selectedEmployee,
      type: selectedOrderType,
      orderCustomerInfo,
    });
    togglePopUp();
  };
  const handleSubmitOrder = async () => {
    console.log("la orden final es ", orderFinal);
    togglePopUp();
    try {
      const response = await createOrder(orderFinal);
      showToast("success", "Orden Creada!");
      navigate("/Ordenes");
      //console.log(response); // Procesar la respuesta como necesites
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 my-5 rounded-main bg-white border shadow">
      <div className="flex flex-row gap-5 mb-10 justify-between flex-wrap">
        <div className="flex flex-col gap-3 ">
          <label htmlFor="">Tipo De Orden</label>
          <select
            className="input-text-sm"
            value={selectedOrderType}
            onChange={handleOrderTypeSelect}
          >
            <option value="3">Comer Acá</option>
            <option value="1">Express</option>
            <option value="2">Para Llevar</option>
          </select>
        </div>
        {selectedOrderType == "3" && (
          <div className="flex flex-col gap-3 ">
            <label htmlFor="">Seleccionar Mesa</label>
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
        <div className="flex flex-col gap-3">
          <label htmlFor="employeeSelect">Seleccionar Empleado</label>
          <select
            id="employeeSelect"
            className="input-text-sm"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Empleados</option>
            {loadingEmployees ? (
              <option>Cargando empleados...</option>
            ) : errorEmployees ? (
              <option>Error al cargar empleados</option>
            ) : (
              employeesData.employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.user_name}{" "}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      <h2>Productos en la orden:</h2>
      <ul>
        <li className="border rounded-main px-3 my-2">
          <div className="flex justify-between items-center">
            <p className="w-6/12 text-xs font-semibold ">Plato</p>
            <p className="w-2/12 text-xs font-semibold">Precio + IVA</p>
            <p className="w-1/12 text-xs text-center font-semibold ">
              Para llevar?
            </p>
            <p className="w-1/12 text-xs font-semibold text-center">Remover</p>
            <p className="w-1/12 text-xs font-semibold text-center">Nota</p>
          </div>
        </li>
        {detailedProducts.map((product, index) => (
          <OrderProductItem
            key={index}
            product={product}
            removeProductFromOrder={() =>
              removeProductFromOrder(product.id, product.uniqueId)
            }
            addComment={addCommentToProduct}
          />
        ))}
      </ul>
      {/* Mostrar el total de precios */}
      <div className="flex flex-col items-end justify-end p-5 mt-5">
        <div className="flex w-60 justify-between">
          <p className="font-bold mr-5 text-sm">Subtotal:</p>
          <FormattedCurrency amount={subtotalPrice} styles="text-sm" />
        </div>
        <div className="flex w-60 justify-between">
          <p className="font-bold mr-5 text-sm">IVA:</p>
          <FormattedCurrency amount={taxes} styles="text-sm" />
        </div>
        {selectedOrderType == "3" && (
          <div className="flex w-60 justify-between">
            <p className="font-bold mr-5 text-sm">Impuesto de servicio 10%:</p>
            <FormattedCurrency amount={totalPrice * 0.1} styles="text-sm" />
          </div>
        )}

        <div className="flex w-60 justify-between mt-5">
          <p className="font-bold mr-5 text-xl">Total:</p>
          <FormattedCurrency amount={totalPrice} styles="text-xl" />
        </div>
      </div>
      <div className="flex flex-row justify-between mt-9">
        {selectedOrderType == "1" && (
          <div className="flex flex-col gap-3 ">
            <label htmlFor="">Nombre De Cliente</label>
            <input
              name="name"
              type="text"
              className="input-text-sm"
              value={orderCustomerInfo.name}
              onChange={handleCustomerInfoChange}
            />

            <label htmlFor="">Teléfono</label>
            <input
              name="phone"
              type="number"
              className="input-text-sm"
              value={orderCustomerInfo.phone}
              onChange={handleCustomerInfoChange}
            />
          </div>
        )}
        {selectedOrderType == "1" && (
          <div className="flex flex-col gap-3 ">
            <label htmlFor="">Dirección de entrega</label>
            <textarea
              className="input-text"
              name="address"
              id=""
              rows="5"
              value={orderCustomerInfo.address}
              onChange={handleCustomerInfoChange}
            ></textarea>
          </div>
        )}
        {selectedOrderType == "2" && (
          <div className="flex flex-col gap-3 ">
            <label htmlFor="">Número de Beeper</label>
            <input type="number" className="input-text-sm" />
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-end">
        <Button
          type={"SEND"}
          onClick={handleConfirmOrder}
          text={"PEDIDO A LA COCINA"}
        ></Button>
      </div>
      <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
        <OrderFinalResume
          close={togglePopUp}
          order={orderFinal}
          products={products}
          handleSubmitOrder={handleSubmitOrder}
          tables={tablesData.tables}
        ></OrderFinalResume>
      </PopUp>
    </div>
  );
};

export default OrderResume;
