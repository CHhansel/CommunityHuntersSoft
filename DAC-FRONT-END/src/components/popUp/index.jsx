import React from 'react';

function PopUp({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center duration-1000">
      <div className="w-11/12 bg-white  rounded-main shadow-lg popup-enter background-fadeIn">
        {children}
      </div>
    </div>
  );
}

export default PopUp;
