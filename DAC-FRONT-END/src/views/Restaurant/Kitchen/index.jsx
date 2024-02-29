import React, { useState } from "react";
import { useFetchUnpaidOrders } from "../../../hooks/orders/useFetchUnpaidOrders";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import OrderView from "../../../components/OrderKitchenView";

const KitchenView = () => {
  const { user } = useSelector(selectUser);

  const [reloadOrders, setReloadOrders] = useState(false); // Trigger para recargar órdenes

  const {
    ordersData,
    loading: unpaidOrdersLoading,
    error: unpaidOrdersError,
  } = useFetchUnpaidOrders(user.company_id, reloadOrders); // Pasar companyId aquí


  const handleReloadOrders = () => {
    setReloadOrders((prev) => !prev); // Cambia el valor para recargar órdenes
  };

  // Renderizar la vista de cocina
  return (
    <div>
    {/* Mostrar el mensaje de carga si las órdenes están cargando */}
    {unpaidOrdersLoading && <div>Cargando órdenes...</div>}

    {/* Mostrar el mensaje de error si hay un error al cargar las órdenes */}
    {unpaidOrdersError && <div>Error al cargar órdenes no pagadas</div>}

    {/* Mostrar las órdenes si están disponibles */}
    <div className="flex flex-row gap-4">
    {ordersData.orders.map(order => (
        <OrderView key={order.id} order={order} />
    ))}

    </div>
</div>
  );
};

export default KitchenView;
