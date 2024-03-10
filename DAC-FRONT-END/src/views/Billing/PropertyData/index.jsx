import React, { useState, useEffect } from 'react';
import PopUp from '../../../components/popUp';
import PropertySearch from '../../../components/PropertySelect'; 

const PropertyData = ({ propertyData, setProperty }) => {
  const [formData, setFormData] = useState({
    name: "",
    customer_id: "",
    province: "",
    canton: "",
    district: "",
  });
  useEffect(() => {
    console.log("cambio", propertyData);
  }, [propertyData])
  
  return (
    <div className="p- my-5 rounded-main bg-white border shadow">
      
    <PropertySearch setProperty={setProperty}></PropertySearch>

   
    </div>
  );
};

export default PropertyData;
