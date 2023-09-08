import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import {TablaDinamica} from '../../components/Table/index'

import { selectUser } from "../../store/authSlice";

import { fetchCustomers } from "../../actions/customer";
import Pagination from "../../components/pagination/pagination";
import { CustomerDetails } from "./CustomerDetails";
import { CustomerCreate } from "./CustomerCreate";
import Breadcrumb from "../../components/breadcrumbs";

const Customer = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [createCustomnerActive, setCreateCustomerActive] = useState(false);
  const { user, token } = useSelector(selectUser);
  const loading = useSelector((state) => state.customers.loading);
  const error = useSelector((state) => state.customers.error);
  const dispatch = useDispatch();

  const customers = useSelector((state) => state.customers.customers);

  const [currentPage, setCurrentPage] = useState(1);
  const totalCustomers = useSelector(
    (state) => state.customers.totalCustomers
  );
  useEffect(() => {
    dispatch(
      fetchCustomers({
        id: user.id,
        page: currentPage,
        itemsPerPage: 10,
        token,
      })
    );
  }, [dispatch, currentPage, user.id, token]);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const status = useSelector((state) => state.customers.status);

  if (status === "loading" || status === "idle") {
    return <div>Loading dashboards ...</div>;
  }
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
            {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <p>Clientes</p> 
      <div className="w-100 flex justify-end px-8">
        <button onClick={ ()=> {setCreateCustomerActive(true); setFilaSeleccionada(null)}} className="bg-main-blue px-6 py-2 border text-white rounded-full">AGREGAR</button>
      </div>
      <TablaDinamica datos={customers} setFilaSeleccionada={setFilaSeleccionada} dataType='Customers'/>
      <Pagination
        totalItems={totalCustomers}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {filaSeleccionada && <CustomerDetails fila={filaSeleccionada} />}
      {createCustomnerActive && filaSeleccionada == null && <CustomerCreate />}
    </div>
  )
}

export default Customer

