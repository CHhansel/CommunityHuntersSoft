import { useEffect, useState } from "react";
import { selectUser } from "../../store/authSlice";
import { useSelector } from "react-redux";
import { TablaDinamica } from "../../components/Table";
import Pagination from "../../components/pagination/pagination";
import { EmployeeCreate } from "./EmployeeCreate";
import { EmployeeDetails } from "./EmployeeDetails";
import useFetchEmployees from "../../hooks/employees/useFetchEmployee";
import { useAlert } from "../../components/Notifications/MySwalNotification";
import { Loading } from "../../components/loading";
import { resumeData } from "../../utils/resumesForTable";

const Employee = () => {
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [CreateEmployeeActive, setCreateEmployeeActive] = useState(false);

  const { user } = useSelector(selectUser);
  const [page, setPage] = useState(1);
  const showToast = useAlert();
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const {
    employeesData: { employees, totalEmployees },
    loading,
    error,
  } = useFetchEmployees(user.company_id, page, 10, reloadTrigger);

  if (loading) {
    return (
      <div className="h-80 ">
        <Loading />
      </div>
    );
  }
  const updateTable = () => {
    setFilaSeleccionada(-1);
    setCreateEmployeeActive(false);
    setReloadTrigger((prev) => prev + 1); // Incrementa el trigger para recargar
  };
  const employeesResume = resumeData(employees,'Employees');
  console.log("esss",employeesResume);
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <div className="w-100 flex justify-end px-8">
        <button
          onClick={() => {
            setFilaSeleccionada(-1), setCreateEmployeeActive(true);
          }}
          className="bg-main-blue px-6 py-2 border text-white rounded-full"
        >
          AGREGAR
        </button>
      </div>
      {employees && employees.length > 0 && (
        <div>
          <TablaDinamica
            datos={employeesResume}
            setFilaSeleccionada={setFilaSeleccionada}
            dataType="Employee"
          />
          <Pagination
            totalItems={totalEmployees}
            itemsPerPage={10}
            currentPage={page}
            // onPageChange={handlePageChange}
          />
        </div>
      )}
      {CreateEmployeeActive && filaSeleccionada < 0 && <EmployeeCreate />}
      {filaSeleccionada >= 0 && (
        <EmployeeDetails
          key={employees[filaSeleccionada].id}
          fila={employees[filaSeleccionada]}
        />
      )}
    </div>
  );
};

export default Employee;
