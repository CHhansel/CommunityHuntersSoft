  // Crear una función para formatear el número en colones

  // Crear una función para formatear el número en colones
  export const formatCurrency = (number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC', // Código de moneda para colones costarricenses
    }).format(number);
  };