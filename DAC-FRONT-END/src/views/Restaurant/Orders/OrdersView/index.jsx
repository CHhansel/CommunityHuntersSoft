import React, { useEffect, useState } from 'react'
import useFetchOrdersPaginated from '../../../../hooks/orders/useFetchOrders';
import { TablaDinamica } from '../../../../components/Table';
import { resumeData } from '../../../../utils/resumesForTable';
import PopUp from '../../../../components/popUp';
import EditOrder from './EditOrder';

const OrdersView = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false); // Variable para recargar los datos cuando cambie su valor
  const { ordersData, loading, error } = useFetchOrdersPaginated(1, 1, 10, reloadTrigger); // Ejemplo de uso con valores de ejemplo
  const [filaSeleccionada, setfilaSeleccionada] = useState(-1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const togglePopUp = () => {
    setSelectedOrder(null);
    setPopUpOpen((prev) => !prev);
    setfilaSeleccionada(-1);
  };
  // Lógica para manejar la recarga de datos
  const handleReloadData = () => {
      setReloadTrigger(!reloadTrigger); // Cambiar el valor de reloadTrigger para recargar los datos
  };


  const ordersDataResume = resumeData(ordersData.orders, "Orders");
  useEffect(() => {
    if (filaSeleccionada > -1) {
      togglePopUp();
      setSelectedOrder(ordersData.orders[filaSeleccionada]);
    }
  }, [filaSeleccionada, ordersData.orders]);
  return (
      <div>
          {loading && <p>Cargando...</p>}
          {error && <p>Error: {error.message}</p>}
          <button onClick={handleReloadData}>Recargar datos</button>
          <h2>Órdenes</h2>

          {ordersData && (
        <TablaDinamica
          datos={ordersDataResume}
          setFilaSeleccionada={setfilaSeleccionada}
          dataType="Order"
        />
      )}
          <p>Total de órdenes: {ordersData.totalOrders}</p>
          <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
          <EditOrder
            onClose={togglePopUp}
            order={selectedOrder}
          ></EditOrder>
        </PopUp>
      </div>
  );
};

export default OrdersView
