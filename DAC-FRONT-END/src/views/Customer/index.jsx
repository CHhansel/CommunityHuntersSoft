import { useSelector } from "react-redux";
import { useState } from "react";
import { TablaDinamica } from "../../components/Table/index";

import { selectUser } from "../../store/authSlice";


import Pagination from "../../components/pagination/pagination";
import { CustomerDetails } from "./CustomerDetails";
import { CustomerCreate } from "./CustomerCreate";

import { useFetchCustomers } from "../../hooks/customers/useFetchCustomers";
import { resumeData } from "../../utils/resumesForTable";

const Customer = () => {
  const { user } = useSelector(selectUser);
  const [currentPage, setCurrentPage] = useState(1);
  const { customers, totalCustomers, loading, error } = useFetchCustomers(
    user.company_id,
    currentPage,
    10
  );

  const customersResume = resumeData(customers,'Customers');
 console.log(customersResume);
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [createCustomerActive, setCreateCustomerActive] = useState(false);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <div className="w-100 flex justify-end px-8">
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
      {customers && customers.length > 0 && (
        <>
          <TablaDinamica
            datos={customersResume}
            setFilaSeleccionada={setFilaSeleccionada}
            dataType="Customers"
          />
          <Pagination
            totalItems={totalCustomers}
            itemsPerPage={10}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {!customers && (
        <div className="w-full h-full bg-slate-500 flex justify-center">
          <p>No posee Clientes Registrados</p>
        </div>
      )}
      {filaSeleccionada >= 0 && (
        <CustomerDetails fila={customers[filaSeleccionada]} />
      )}
      {createCustomerActive && filaSeleccionada == -1 && <CustomerCreate />}
    </div>
  );
};

export default Customer;
