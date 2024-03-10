
const FormattedCurrency = ({ amount, styles="" }) => {
  // Función para formatear el número a un formato de moneda específico
  const formatCurrency = (amount) => {
    // Asumiendo que no necesitas decimales para colones y quieres usar comas para los miles
    // y puntos para los decimales (aunque lo común en colones es no usar decimales)
    amount = amount*1;
    return amount.toLocaleString('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0, // Cambiar a 2 si se desean centavos
      maximumFractionDigits: 0, // Cambiar a 2 si se desean centavos
    });
  };

  return (
    <p className={styles}>{formatCurrency(amount)}</p>
  );
};

export default FormattedCurrency;
