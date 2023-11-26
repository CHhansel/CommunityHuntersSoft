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
    if (propertyData) {
      setFormData(propertyData);
    }
  }, [propertyData]);
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  const togglePopUp = () => {
    setPopUpOpen(prev => !prev);
  } 
  return (
    <div className="p-10 my-5 rounded-main bg-white border shadow">
      
      <button className='my-5 button-success' onClick={togglePopUp}>Buscar Propiedad</button>
      <PopUp isOpen={isPopUpOpen} onClose={togglePopUp}>
        <PropertySearch setPropertyData={setFormData} setProperty={setProperty}></PropertySearch>
      </PopUp>
      <form className="flex justify-between flex-wrap items-start gap-5 w-full">
        <div className="flex flex-col gap-3">
          <label>Nombre:</label>
          <input
            className="input-text"
            type="text"
            name="name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>ID del Cliente:</label>
          <input
            className="input-text"
            type="text"
            name="customer_id"
            value={formData.customer_id}
            onChange={e => setFormData(prev => ({ ...prev, customer_id: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Provincia:</label>
          <input
            className="input-text"
            type="text"
            name="province"
            value={formData.province}
            onChange={e => setFormData(prev => ({ ...prev, province: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Cantón:</label>
          <input
            className="input-text"
            type="text"
            name="canton"
            value={formData.canton}
            onChange={e => setFormData(prev => ({ ...prev, canton: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Distrito:</label>
          <input
            className="input-text"
            type="text"
            name="district"
            value={formData.district}
            onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
          />
        </div>
      </form>
    </div>
  );
};

export default PropertyData;
