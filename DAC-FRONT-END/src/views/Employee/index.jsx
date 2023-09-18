import { useEffect, useState } from "react";
import { selectUser } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../actions/employee";
import { TablaDinamica } from "../../components/Table";
import Pagination from "../../components/pagination/pagination";

const Employee = () => {
  const dispatch = useDispatch();
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1);

  const { user, token } = useSelector(selectUser);
  const totalEmployees = useSelector((state) => state.employees.totalEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const employees = useSelector((state) => state.employees.employees);

  useEffect(() => {
    dispatch(
      fetchEmployees({
        id: user.id,
        page: currentPage,
        itemsPerPage: 10,
        token,
      })
    );
  }, [dispatch, currentPage, user.id, token]);
  console.log(employees, totalEmployees);
  const employeeResume = JSON.parse(JSON.stringify(employees));
  employeeResume.forEach((employee) => {
    delete employee.role_id;
    delete employee.employee_user_id;
    delete employee.hire_date;
    delete employee.company_name;
    delete employee.client_id;
  });
  return (
    <div>
      Employee
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
  );
};

export default Employee;
