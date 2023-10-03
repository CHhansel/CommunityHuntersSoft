import { useEffect, useState } from "react";
import { selectUser } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../actions/employee";
import { TablaDinamica } from "../../components/Table";
import Pagination from "../../components/pagination/pagination";
import { EmployeeCreate } from "./EmployeeCreate";
import { EmployeeDetails } from "./EmployeeDetails";

const Employee = () => {
  const dispatch = useDispatch();
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);
  const [CreateEmployeeActive, setCreateEmployeeActive] = useState(false);

  const { user, token } = useSelector(selectUser);
  const totalEmployees = useSelector((state) => state.employees.totalEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const employees = useSelector((state) => state.employees.employees);
  const status = useSelector((state) => state.employees.status);
  useEffect(() => {
    dispatch(
      fetchEmployees({
        user_id: user.id,
        company_id: user.company_id,
        page: currentPage,
        itemsPerPage: 100,
        token,
      })
    );
  }, [dispatch, currentPage, user.id, token]);
  const employeeResume = JSON.parse(JSON.stringify(employees));
  employeeResume.forEach((employee) => {
    delete employee.role_id;
    delete employee.employee_user_id;
    delete employee.hire_date;
    delete employee.company_name;
    delete employee.user_name;
    delete employee.company_id;
    delete employee.client_id;
  });
  return (
    <div className="w-full px-16 flex flex-col justify-start h-full">
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
      {status == "succeeded" && (
        <div>
          <TablaDinamica
            datos={employeeResume}
            setFilaSeleccionada={setFilaSeleccionada}
            dataType="Employee"
          />
          <Pagination
            totalItems={totalEmployees}
            itemsPerPage={10}
            currentPage={currentPage}
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
