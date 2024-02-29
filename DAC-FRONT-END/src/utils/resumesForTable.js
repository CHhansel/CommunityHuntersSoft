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
    case "Orders":
      data = resumeOrderData(completeData);
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
    number: table.number,
    Disponibilidad: table.reserved,
    in_use: table.in_use,
    Capacidad: table.max_capacity,
  }));
};
const resumeOrderData = (orders) => {
  // Función para mapear el valor numérico del tipo a la descripción correspondiente
  const mapTypeToDescription = (type) => {
    switch (type) {
      case 1:
        return "Express";
      case 2:
        return "Para Llevar";
      case 3:
        return "Comer Acá";
      default:
        return "Tipo Desconocido"; // En caso de recibir un valor no esperado
    }
  };
  // Función para mapear el valor numérico del estado a la descripción correspondiente
  const mapStateToDescription = (state) => {
    switch (state) {
      case 0:
        return "Esperando";
      case 1:
        return "En cocina";
      case 2:
        return "Entregado";
      case 3:
        return "Facturado";
      default:
        return "Estado Desconocido"; // En caso de recibir un valor no esperado
    }
  };
  return orders.map((order) => ({
    order_number: order.order_number,
    state: mapStateToDescription(order.pagado),
    // Usamos la función mapTypeToDescription para obtener la descripción del tipo
    type: mapTypeToDescription(order.type),
    customer_address: order.customer_address,
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
  }));
};
