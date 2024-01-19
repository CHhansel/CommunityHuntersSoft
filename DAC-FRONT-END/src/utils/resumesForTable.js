

export function resumeData(completeData, dataType) {
    let  data;
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
      case "Employee":
       // data = parseEmployeeColumnNames(data);
        break;
      case "Cabys":
       // data = parseCabysColumnNames(data);
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
      email: customer.email
    }));
  };
  
  



  
