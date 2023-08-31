import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TablaDinamica } from "../../components/Table/index";

import { ContractDetails } from "./ContractDetails";
import { ContractCreate } from "./ContractCreate";
import { fetchContracts } from "../../actions/contracts";
import { selectUser } from "../../store/authSlice";
import Pagination from "../../components/pagination/pagination";

const Contract = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [createContractActive, setCreateContractActive] = useState(true);
  const { user, token } = useSelector(selectUser);

  const loading = useSelector((state) => state.contracts.loading);
  const error = useSelector((state) => state.contracts.error);
  const dispatch = useDispatch();

  const contracts = useSelector((state) => state.contracts.contracts);

  const totalContracts = useSelector(
    (state) => state.contracts.totalContracts
  );
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    dispatch(
      fetchContracts({
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
  const status = useSelector((state) => state.contracts.status);
  if (status === "loading" || status === "idle") {
    return <div>Loading dashboards ...</div>;
  }
  const contractsTableInfo = JSON.parse(JSON.stringify(contracts));

  contractsTableInfo.forEach(contract => {
      delete contract.contract_file;
      delete contract.terms_and_conditions;
  });
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <p>Contratos</p>
      <div className="w-100 flex justify-end px-8">
        <button onClick={ ()=> {setCreateContractActive(true); setFilaSeleccionada(null)}} className="bg-main-blue px-6 py-2 border text-white rounded-full">AGREGAR</button>
      </div>
      <TablaDinamica
        datos={contractsTableInfo}
        setFilaSeleccionada={setFilaSeleccionada}
        dataType='Contracts'
      />
      <Pagination
        totalItems={totalContracts}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {filaSeleccionada && (
        <ContractDetails key={filaSeleccionada.id} fila={filaSeleccionada} />
      )}
      {createContractActive && filaSeleccionada == null && <ContractCreate />}
    </div>
  );
};

export default Contract;
