import { useState } from 'react';

function useFormFields(initialState, validate) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    const newFields = { ...fields, [name]: value };
    setFields(newFields);
    if (validate) {
      const newErrors = validate(newFields);
      setErrors(newErrors);
    }
  };

  return [fields, handleFieldChange, errors];
}


function validateForm(fields) {
    const errors = {};
    if (!fields.email) {
      errors.email = 'Email is required';
    } 
    return errors;
  }