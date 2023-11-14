import React from 'react';

function PopUp({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg ">
        <div className='w-100  flex justify-between px-5'>
        <button 
          onClick={onClose} 
          className="button-success"
        >
          Seleccionar
        </button>
        <button 
          onClick={onClose} 
          className="text-red-500 hover:text-red-700 mb-2 size text-3xl"
        >
          x
        </button>

        </div>
        {children}
      </div>

    </div>
  );
}

export default PopUp;
