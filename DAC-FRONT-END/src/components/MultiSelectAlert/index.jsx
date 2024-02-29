import React, { useState, useEffect } from 'react';

const DropdownOptions = ({ options, initialSelectedOptions, setSelectedOptions }) => {
  const [selected, setSelected] = useState([]);
 console.log("options es ",options);
  useEffect(() => {
    // Transforma `initialSelectedOptions` para extraer solo los nombres (o IDs)
    const initialSelectedNames = initialSelectedOptions.map(option => option.name); // Cambiar `name` por `id` si es necesario
    setSelected(initialSelectedNames);
    setSelectedOptions(initialSelectedOptions); // Agrega las opciones seleccionadas inicialmente
  }, [initialSelectedOptions, setSelectedOptions]);

  const handleOptionChange = (option) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(option.name)) { // Cambiar `name` por `id` si es necesario
        // Elimina la opción si ya está seleccionada
        const updatedSelected = prevSelected.filter((itemName) => itemName !== option.name); // Cambiar `name` por `id` si es necesario
        setSelectedOptions((prevOptions) => prevOptions.filter((opt) => opt.name !== option.name)); // Cambiar `name` por `id` si es necesario
        return updatedSelected;
      } else {
        // Agrega la opción si no está seleccionada
        console.log("initial es ",initialSelectedOptions);
        setSelectedOptions((prevOptions) => [...prevOptions, option]);
        return [...prevSelected, option.name]; // Cambiar `name` por `id` si es necesario
      }
    });
  };

  return (
    <div>
      <div className="bg-white shadow-lg border rounded-main">
        <div className="h-[170px] overflow-y-auto p-2 mb-2">
          {options.map((option, index) => (
            <label key={index} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                value={option.name} // Cambiar `name` por `id` si es necesario
                onChange={() => handleOptionChange(option)}
                checked={selected.includes(option.name)} // Cambiar `name` por `id` si es necesario
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-3 text-sm text-gray-700">{option.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownOptions;
