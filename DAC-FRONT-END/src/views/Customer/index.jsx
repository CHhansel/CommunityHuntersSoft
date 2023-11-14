import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TablaDinamica } from "../../components/Table/index";

import { selectUser } from "../../store/authSlice";

import { fetchCustomers } from "../../actions/customer";
import Pagination from "../../components/pagination/pagination";
import { CustomerDetails } from "./CustomerDetails";
import { CustomerCreate } from "./CustomerCreate";
import { CustomerService } from "../../services/customerService";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [customersSimplified, setCustomersSimplified] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useSelector(selectUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [createCustomerActive, setCreateCustomerActive] = useState(false);



  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await CustomerService.getCustomers(token, user.company_id, currentPage, 10);
        setCustomers(data.customers);
        setTotalCustomers(data.totalCustomers);
        setCustomersSimplified(data.customers.map(customer => ({
          nombre: customer.name,
          apellido: customer.lastname,
          dni: customer.dni,
          email: customer.email
        })))
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchCustomers();

  }, [currentPage, user.company_id, token]);
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
      { customers && customers.length > 0 &&
        <>
          <TablaDinamica
            datos={customersSimplified}
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
      }
      { !customers && <div className="w-full h-full bg-slate-500 flex justify-center"><p>No posee Clientes Registrados</p></div>}
      {filaSeleccionada >= 0 && <CustomerDetails fila={customers[filaSeleccionada]} />}
      {createCustomerActive && filaSeleccionada == -1 && <CustomerCreate />}
    </div>
  );
};

export default Customer;
