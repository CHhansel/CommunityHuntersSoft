import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TablaDinamica } from "../../components/Table/index";

import { PropertyDetail } from "./PropertyDetails";
import { PropertyCreate } from "./PropertyCreate";
import { fetchProperties } from "../../actions/properties";
import { selectUser } from "../../store/authSlice";
import Pagination from "../../components/pagination/pagination";

const Property = () => {

  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);

  const [createPropertyActive, setCreatePropertyActive] = useState(false);

  const { user, token } = useSelector(selectUser);
  
  //const error = useSelector((state) => state.properties.error);
  const dispatch = useDispatch();

  const properties = useSelector((state) => state.properties.properties);

  const totalProperties = useSelector(
    (state) => state.properties.totalProperties
  );
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    dispatch(
      fetchProperties({
        id: user.id,
        page: currentPage,
        itemsPerPage: 10,
        token,
      })
    );
  }, [dispatch, currentPage, user.id, token,totalProperties]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const status = useSelector((state) => state.properties.status);
  if (status === "loading" || status === "idle") {
    return <div>Cargando Propiedades ...</div>;
  }

  // propiedades Resumidas para la tabla
  const propertiesResume = JSON.parse(JSON.stringify(properties));
  propertiesResume.forEach((property) => {
    delete property.customer_id;
    delete property.start_date;
    delete property.start_date;
    delete property.end_date;
    delete property.start_date;
    delete property.deposit_amount;
    delete property.rent_amount;
    delete property.tax_amount;
    delete property.total_amount;
    delete property.payment_method;
    delete property.payment_date;
    delete property.contract_file;
    delete property.payment_method;
    delete property.creation_date;
  });
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
      <div className="w-100 flex justify-end px-8">
        <button
          onClick={() => {
            setFilaSeleccionada(-1), setCreatePropertyActive(true);
          }}
          className="bg-main-blue px-6 py-2 border text-white rounded-full"
        >
          AGREGAR
        </button>
      </div>
      <TablaDinamica
        datos={propertiesResume}
        setFilaSeleccionada={setFilaSeleccionada}
        dataType="Properties"
      />
      <Pagination
        totalItems={totalProperties}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {filaSeleccionada >= 0 && (
        <PropertyDetail
          key={properties[filaSeleccionada].id}
          fila={properties[filaSeleccionada]}
        />
      )}
      {createPropertyActive && filaSeleccionada < 0 && <PropertyCreate />}
    </div>
  );
};

export default Property;
