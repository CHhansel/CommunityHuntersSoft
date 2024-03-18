import { useSelector } from "react-redux";
import { useState } from "react";
import { TablaDinamica } from "../../components/Table/index";

import { selectUser } from "../../store/authSlice";

import Pagination from "../../components/pagination/pagination";
import { CustomerDetails } from "./CustomerDetails";
import { CustomerCreate } from "./CustomerCreate";

import { useFetchCustomers } from "../../hooks/customers/useFetchCustomers";
import { resumeData } from "../../utils/resumesForTable";
import { Loading } from "../../components/loading";
import { useAlert } from "../../components/Notifications/MySwalNotification";

const Customer = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [createCustomerActive, setCreateCustomerActive] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const { user } = useSelector(selectUser);
  const [page, setPage] = useState(1);
  const showToast = useAlert();

  const { customersData: { customers, totalCustomers }, loading, error } = useFetchCustomers(
    user.company_id,
    page,
    10,
    reloadTrigger
  );

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  const updateTable = () => {
    setFilaSeleccionada(-1);
    setCreateCustomerActive(false);
    setReloadTrigger((prev) => prev + 1); // Incrementa el trigger para recargar
  };

  const customersResume = resumeData(customers,'Customers');
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">      
      <div className="w-100 flex justify-end px-8">
      {loading && <p>Cargando...</p>}
        <button
          onClick={() => {
            setCreateCustomerActive(true);
            setFilaSeleccionada(-1);
          }}
          className="bg-main-blue px-6 py-2 border text-white rounded-full"
          >
          AGREGAR
        </button>
      </div>
      {error && <div className="w-full mt-20">No hay Clientes </div>}
      { customers && totalCustomers > 0 && (
        <>
          <TablaDinamica
            datos={customersResume}
            setFilaSeleccionada={setFilaSeleccionada}
            dataType="Customers"
          />
          <Pagination
            totalItems={totalCustomers}
            itemsPerPage={10}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {!customers && (
        <div className="w-full h-full bg-slate-100 flex justify-center p-5 my-5">
          <p>No posee Clientes Registrados</p>
        </div>
      )}
      {filaSeleccionada >= 0 && (
        <CustomerDetails fila={customers[filaSeleccionada]} updateTable={updateTable} />
      )}
      {createCustomerActive && filaSeleccionada == -1 && <CustomerCreate updateTable={updateTable} />}
    </div>
  );
};

export default Customer;
