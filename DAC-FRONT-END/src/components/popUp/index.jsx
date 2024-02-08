import React, { useEffect, useRef } from "react";

function PopUp({ children, isOpen, onClose }) {
  const popUpRef = useRef(); // Referencia al contenedor del PopUp

  // Cerrar el PopUp si se hace clic fuera del contenido
  const handleCloseOnClickOutside = (event) => {
    if (popUpRef.current && !popUpRef.current.contains(event.target)) {
      onClose(); // Llama a onClose si el clic fue fuera del PopUp
    }
  };
  useEffect(() => {
    // Agrega el listener cuando el PopUp está abierto
    if (isOpen) {
      document.addEventListener("mousedown", handleCloseOnClickOutside);
    }

    // Limpia el listener cuando el PopUp se cierra
    return () => {
      document.removeEventListener("mousedown", handleCloseOnClickOutside);
    };
  }, [isOpen, onClose]); // Asegúrate de agregar onClose aquí para manejar correctamente las dependencias

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center duration-1000">
      <div ref={popUpRef} className="w-11/12 bg-white  rounded-main shadow-lg popup-enter background-fadeIn">
        {children}
      </div>
    </div>
  );
}

export default PopUp;
