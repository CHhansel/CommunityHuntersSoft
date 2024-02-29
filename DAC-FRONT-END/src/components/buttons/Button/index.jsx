
import add_icon from "../../../assets/add-icon-blue.svg";
import cancel_icon from "../../../assets/cancel-icon.svg";
import update_icon from "../../../assets/update-icon-blue.svg";
import delete_icon from "../../../assets/delete-icon.svg";
import kitchen_icon from "../../../assets/kitchen-icon.svg";
import undo_icon from "../../../assets/undo-icon.svg";

const buttonConfigs = {
    ADD: {
      text: 'AGREGAR',
      icon: add_icon, // Reemplaza con el path de tu icono
      className: 'button-add'
    },
    UPDATE: {
      text: 'ACTUALIZAR',
      icon: update_icon, // Reemplaza con el path de tu icono
      className: 'button-add'
    },
    DELETE: {
      text: 'BORRAR',
      icon: delete_icon, // Reemplaza con el path de tu icono
      className: 'button-delete'
    },
    CANCEL: {
        text: 'CANCELAR',
        icon: cancel_icon, // Reemplaza con el path de tu icono
        className: 'button-cancel'
      },
      SEND: {
        text: 'ENVIAR',
        icon: kitchen_icon, // Reemplaza con el path de tu icono
        className: 'button-delete'
      },
      CONFIRM: {
        text: 'CONFIRMAR',
        icon: kitchen_icon, // Reemplaza con el path de tu icono
        className: 'button-delete'
      },
      UNDO: {
        text: 'REGRESAR',
        icon: undo_icon, // Reemplaza con el path de tu icono
        className: 'button-cancel'
      },
    // Agrega más tipos y configuraciones según sea necesario
  };

const Button = ({ type, onClick, text }) => {
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
          {config.text} {text}
        </button>
      );
  };
  
  export default Button;