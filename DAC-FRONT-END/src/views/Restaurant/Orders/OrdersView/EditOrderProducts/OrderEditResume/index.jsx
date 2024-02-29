import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateOrder from "../../../../../../hooks/orders/useCreateOrder";
import { useFetchRestaurantTables } from "../../../../../../hooks/tables/fetchRestaurantTables";
import OrderProductItem from "../../../../../../components/OrderProduct";
import FormattedCurrency from "../../../../../../components/NumberFormat";
import Button from "../../../../../../components/buttons/Button";
import PopUp from "../../../../../../components/popUp";
import OrderFinalResume from "../../../CreateOrder/OrderResume/OrderFinalResume";
import { useAlert } from "../../../../../../components/Notifications/MySwalNotification";

const OrderEditResume = ({
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
  const { createOrder } = useCreateOrder();
  const [orderCustomerInfo, setOrderCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [orderFinal, setOrderFinal] = useState({});
  const company_id = 1; // Asumiendo que tienes un company_id definido, ajusta según tu implementación
  const { tablesData } = useFetchRestaurantTables(company_id, reloadTrigger);
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
      detailedProducts.forEach((product) => {
        const productTotalPrice = product.price * 1;
        const productTax = (productTotalPrice * product.tax_rate) / 100; // Calcula el impuesto del producto
        subtotal += productTotalPrice - productTax; // Suma al subtotal el precio del producto sin impuestos
        totalTax += productTax; // Acumula el total de impuestos
      });

      let total = subtotal + totalTax; // Calcula el total incluyendo impuestos

      return { subtotal, totalTax, total }; // Retorna ambos valores para usarlos posteriormente
    };

    const { subtotal, totalTax, total } = calculateTotals();
    setTotalPrice(total); // Ajusta según cómo quieras manejar el subtotal en tu estado/componente
    setTaxes(totalTax);
    setSubtotalPrice(subtotal);
  }, [detailedProducts, orderDetails.products]); // Añade selectedOrderType a las dependencias

  const handleConfirmOrder = () => {
    if (detailedProducts.length <= 0) {
      showToast("warning", "La orden no posee productos!");
      return;
    }
    setOrderFinal({
      ...orderDetails,
      subtotalPrice,
      total: totalPrice,
      orderCustomerInfo,
    });
    togglePopUp();
  };
  const handleSubmitOrder = async () => {
    togglePopUp();
    try {
      const response = await createOrder(orderFinal);
      showToast("success", "Orden Creada!");
      navigate("/Ordenes");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 my-5 rounded-main bg-white border shadow">
      <div className="flex flex-row gap-5 mb-10 justify-between flex-wrap">
        <p>Tipo de Orden: {}</p>
      </div>
      <h2>Productos en la orden:</h2>
      <ul>
        <li className="border rounded-main p-3 my-2">
          <div className="flex justify-between items-center">
            <p className="w-6/12 text-xs font-semibold">Plato</p>
            <p className="w-2/12 text-xs font-semibold">Precio + IVA</p>
            <p className="w-1/12 text-xs font-semibold">Para llevar?</p>
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

export default OrderEditResume;
