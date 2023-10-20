export function parseProperties(properties) {
  return properties.map((property) => {
    const rawDate = property.creation_date;
    const formattedDate = new Date(rawDate).toLocaleDateString();

    return {
      Id: property.Id,
      Nombre: property.name,
      Descripción: property.description,
      Estado: property.state,
      Provincia: property.province,
      Cantón: property.canton,
      Distrito: property.district,
      "Dirección Exacta": property.exact_address,
      "Fecha de Creación": formattedDate,
    };
  });
}

function parseCustomerColumnNames(columns) {
  const translations = {
    Id: "ID",
    name: "Nombre",
    lastname: "Apellido",
    dni: "DNI",
    dni_type_id: "Tipo de DNI",
    email: "Correo",
    company_name: "Nombre de la Empresa",
    note: "Nota",
    creation_date: "Fecha de Creación",
    province: "Provincia",
    canton: "Cantón",
    district: "Distrito",
    exact_address: "Dirección Exacta",
  };

  return columns.map((column) => translations[column] || column);
}

export function parseData(data, dataType) {
  switch (dataType) {
    case "Properties":
      data = parseColumnNames(data);
      break;
    case "Customers":
      data = parseCustomerColumnNames(data);
      break;
    case "Contracts":
      data = parseContractColumnNames(data);
      break;
    case "Employee":
      data = parseEmployeeColumnNames(data);
      break;
    case "Cabys":
      data = parseCabysColumnNames(data);
      break;
    default:
      break;
  }
  return data;
}

function parseColumnNames(columns) {
  const translations = {
    Id: "ID",
    name: "Nombre",
    description: "Descripción",
    user_id: "ID de Usuario",
    state: "Estado",
    creation_date: "Fecha de Creación",
    user_info_name: "Nombre de Usuario",
    province: "Provincia",
    canton: "Cantón",
    district: "Distrito",
    exact_address: "Dirección Exacta",
    antiquity: "Antiguedad",
    users_count: "Usuarios",
  };

  return columns.map((column) => translations[column] || column);
}
function parseContractColumnNames(columns) {
  const translations = {
    contract_id: "ID de Contrato",
    start_date: "Fecha de Inicio",
    end_date: "Fecha de Finalización",
    rent_amount: "Monto de Alquiler",
    tax_amount: "Monto de Impuesto",
    payment_method: "Método de Pago",
    deposit_amount: "Monto de Depósito",
    payment_date: "Fecha de Pago",
    active: "Activo",
    terms_and_conditions: "Términos y Condiciones",
    created_at: "Fecha de Creación",
    contract_file: "Archivo de Contrato",
    customer_name: "Nombre del Cliente",
    customer_lastname: "Apellido del Cliente",
    property_name: "Nombre de Propiedad",
  };

  return columns.map((column) => translations[column] || column);
}
function parseEmployeeColumnNames(columns) {
  const translations = {
    company_name: "Nombre de Empresa",
    employee_name: "Nombre",
    employee_lastname: "Apellido",
    role_name: "Rol",
    dni: "DNI",
    dni_type_id: "Tipo de DNI",
    email: "Correo",
    phone_number: "Telefono",
    salary: "Salario",
    hire_date: "Fecha de Contratación",
    province: "Provincia",
    canton: "Cantón",
    district: "Distrito",
    exact_address: "Dirección Exacta",
  };

  return columns.map((column) => translations[column] || column);
}
function parseCabysColumnNames(columns) {
  const translations = {
    cat1desc: "Categoría 1",
    cat2desc: "Categoría 2",
    cat3desc: "Categoría 3",
    cat4desc: "Categoría 4",
    cat5desc: "Categoría 5",
    cat6desc: "Categoría 6",
    cat7desc: "Categoría 7",
    cat8desc: "Categoría 8",
    code: "Código",
    tax: "Impuesto %",
    description: "Descripción",
    district: "Distrito",
    exact_address: "Dirección Exacta",
  };

  return columns.map((column) => translations[column] || column);
}
