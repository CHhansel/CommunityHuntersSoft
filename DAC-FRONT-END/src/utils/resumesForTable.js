

export function resumeData(properties, dataType) {
    let  data;
    switch (dataType) {
      case "Properties":
       data = resumePropertyData(properties);
        break;
      case "Customers":
       // data = parseCustomerColumnNames(data);
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


  const resumePropertyData = (properties)=>{
    const propertiesResume = JSON.parse(JSON.stringify(properties));
    console.log("es ");
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
        delete property.company_id;
        delete property.exact_address;
        delete property.antiquity;
        delete property.description;
        delete property.customer_dni;
        delete property.dni_type_description;
      });
      
      return propertiesResume;
  }