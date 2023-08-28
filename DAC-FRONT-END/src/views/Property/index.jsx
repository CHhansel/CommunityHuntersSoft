import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TablaDinamica } from "../../components/Table/index";

import { PropertyDetail } from "./PropertyDetails";
import { PropertyCreate } from "./PropertyCreate";
import { fetchProperties } from "../../actions/properties";
import { selectUser } from "../../store/authSlice";
import Pagination from "../../components/pagination/pagination";

const Property = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [createPropertyActive, setCreatePropertyActive] = useState(false);
  const { user, token } = useSelector(selectUser);

  const loading = useSelector((state) => state.properties.loading);
  const error = useSelector((state) => state.properties.error);
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
  }, [dispatch, currentPage, user.id, token]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const status = useSelector((state) => state.properties.status);
  if (status === "loading" || status === "idle") {
    return <div>Loading dashboards ...</div>;
  }
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <p>Propiedades</p>
      <div className="w-100 flex justify-end px-8">
        <button onClick={ ()=> {setCreatePropertyActive(true); setFilaSeleccionada(null)}} className="bg-main-blue px-6 py-2 border text-white rounded-full">AGREGAR</button>
      </div>
      <TablaDinamica
        datos={properties}
        setFilaSeleccionada={setFilaSeleccionada}
        dataType='Properties'
      />
      <Pagination
        totalItems={totalProperties}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />{" "}
      {filaSeleccionada && (
        <PropertyDetail key={filaSeleccionada.id} fila={filaSeleccionada} />
      )}
      {createPropertyActive && filaSeleccionada == null && <PropertyCreate />}
    </div>
  );
};

export default Property;
