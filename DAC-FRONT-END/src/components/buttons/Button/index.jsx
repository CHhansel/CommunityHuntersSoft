
import add_icon from "../../../assets/add-icon-blue.svg";
const buttonConfigs = {
    ADD: {
      text: 'AGREGAR',
      icon: add_icon, // Reemplaza con el path de tu icono
      className: 'button-add'
    },
    DELETE: {
      text: 'BORRAR',
      icon: add_icon, // Reemplaza con el path de tu icono
      className: 'button-delete'
    },
    CANCEL: {
        text: 'CANCELAR',
        icon: add_icon, // Reemplaza con el path de tu icono
        className: 'button-cancel'
      },
    // Agrega más tipos y configuraciones según sea necesario
  };

const Button = ({ type, onClick }) => {
    // Si el tipo no está definido en buttonConfigs, establece valores predeterminados o retorna null
    const config = buttonConfigs[type] || null;
  
    if (!config) {
      console.error(`Button type "${type}" is not defined.`);
      return null; // O podrías mostrar un botón predeterminado o realizar otra acción
    }
  
    return (
        <button
          onClick={onClick}
          className={`${config.className}`}
          type="button"
        >
          {config.icon && <img src={config.icon} className="inline-block" alt={`${config.text} icon`} />}
          {config.text}
        </button>
      );
  };
  
  export default Button;