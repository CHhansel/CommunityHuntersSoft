import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectUser } from "../../../store/authSlice";
import OrderView from "../../../components/OrderKitchenView";
import { useFetchUnpaidOrders } from "../../../hooks/orders/useFetchUnpaidOrders";
import Button from "../../../components/buttons/Button";
import FontSizeAdjuster from "../../../components/FontSizeAjust";

const KitchenView = () => {
  const { user } = useSelector(selectUser);
  const navigate = useNavigate(); // Usar el hook useNavigate
  const [reloadOrders, setReloadOrders] = useState(false);
  const handleGoToDashboard = () => {
    navigate('/dashboard'); // Redireccionar a la ruta /dashboard
  };
  const {
    ordersData,
    loading: unpaidOrdersLoading,
    error: unpaidOrdersError,
  } = useFetchUnpaidOrders(user.company_id, reloadOrders);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Esto activará una recarga de los datos cada N milisegundos
      setReloadOrders((prev) => !prev);
    }, 10000); // Ajusta este valor al intervalo deseado, por ejemplo, 5000 milisegundos (5 segundos)

    return () => clearInterval(intervalId); // Limpieza en el desmontaje del componente
  }, []);

  return (
    <div className="bg-black h-full w-full p-5">
      {unpaidOrdersLoading && <div>Cargando órdenes...</div>}
      {unpaidOrdersError && <div>Error al cargar órdenes no pagadas</div>}
      <div className="absolute mt-1">
        <Button type="KITCHEN_BACK" onClick={handleGoToDashboard}></Button>
      </div>
      <div className="absolute right-5 mt-1">
        <FontSizeAdjuster />
      </div>
      <div className="flex justify-center gap-5 my-5">
        <p className="bg-green-500 p-3 rounded-full font-bold text-white">Para llevar </p>
        <p className="bg-red-500 p-3 rounded-full font-bold text-white">Express </p>
        <p className="bg-blue-500 p-3 rounded-full font-bold text-white">Comer Aca </p>
      </div>
      <div className="flex flex-row gap-4 flex-wrap justify-center">
        {ordersData.orders.map((order) => (
          <OrderView key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default KitchenView;
