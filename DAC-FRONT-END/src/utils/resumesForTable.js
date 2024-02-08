export function resumeData(completeData, dataType) {
  let data;
  switch (dataType) {
    case "Properties":
      data = resumePropertyData(completeData);
      break;
    case "Customers":
      data = resumeCustomerData(completeData);
      break;
    case "Contracts":
      // data = parseContractColumnNames(data);
      break;
    case "Employees":
      data = resumeEmployeeData(completeData);
      break;
    case "Cabys":
      // data = parseCabysColumnNames(data);
      break;
    case "Tables":
      data = resumeTableData(completeData);
      break;
    default:
      break;
  }
  return data;
}

const resumePropertyData = (properties) => {
  return properties.map((property) => ({
    Id: property.internal_code,
    name: property.name,
    exact_address: property.exact_address,
    state: property.state,
  }));
};

const resumeCustomerData = (customers) => {
  return customers.map((customer) => ({
    dni: customer.dni,
    name: customer.name + " " + customer.lastname,
    email: customer.email,
  }));
};
const resumeEmployeeData = (employees) => {
  return employees.map((employee) => ({
    name: employee.employee_name + " " + employee.employee_lastname,
    email: employee.email,
    role: employee.role_name,
  }));
};
const resumeTableData = (tables) => {
  return tables.map((table) => ({
    id: table.id,
    number: table.number,
    reserved: table.reserved,
    in_use: table.in_use,
    max_capacity: table.max_capacity
  }));
};