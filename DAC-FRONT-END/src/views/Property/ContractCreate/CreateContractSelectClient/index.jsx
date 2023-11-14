import { useEffect, useState } from "react";
import { fetchCustomers } from "../../../../actions/customer";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../../store/authSlice";
import { TablaDinamica } from "../../../../components/Table";
import Pagination from "../../../../components/pagination/pagination";

// eslint-disable-next-line react/prop-types
const Index = ({ setFormData }) => {
  const { user, token } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [filaSeleccionada, setFilaSeleccionada] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchCustomers({
        user_id: user.id,
        company_id: user.company_id,
        page: 1,
        itemsPerPage: 1000,
        token,
      })
    );
  }, [dispatch, user.id, token]);
  const status = useSelector((state) => state.customers.status);

  const customers = useSelector((state) => state.customers.customers);
  const totalCustomers = useSelector((state) => state.customers.totalCustomers);
  const customersResume = JSON.parse(JSON.stringify(customers));
  customersResume.forEach((customer) => {
    delete customer.province;
    delete customer.canton;
    delete customer.district;
    delete customer.exact_address;
    delete customer.start_date;
    delete customer.dni_type_id;
    delete customer.company_name;
    delete customer.creation_date;
    delete customer.note;
    delete customer.company_id;
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    if (filaSeleccionada >= 0) {
      const customerId = customers[filaSeleccionada].Id;
      setFormData((prevData) => ({
        ...prevData,
        customer_id: customerId,
      }));
    }
  }, [filaSeleccionada]);
  if (status !== "succeeded") {
    return <div>Cargando clientes s...</div>;
  }
  return (
    <div className=" m-auto">
      <p className="text-xl">Seleccione el Cliente</p>
      {customers && (
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
    </div>
  );
};

export default Index;
