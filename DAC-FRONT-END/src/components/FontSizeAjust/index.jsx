import { useEffect, useRef, useState } from 'react';

function FontSizeAdjuster() {
  const [fontSize, setFontSize] = useState(16); // Tamaño inicial de 16px
  const [isOpen, setIsOpen] = useState(false); // Controla si los botones están visibles o no

  const increaseFontSize = () => {
    if (fontSize < 22) {
      setFontSize(prevSize => prevSize + 2);
      document.documentElement.style.setProperty('--base-font-size', `${fontSize + 2}px`);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(prevSize => prevSize - 2);
      document.documentElement.style.setProperty('--base-font-size', `${fontSize - 2}px`);
    }
  };

  const getLabel = () => {
    const difference = fontSize - 16;
    return `x ${difference >= 0 ? '' : ''}${difference}`;
  };
  const containerRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && !toggleButtonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="flex items-center mt-[5px]" ref={containerRef}>
      {isOpen && (
        <div className=" bg-white border shadow flex items-center w-[150px] h-[40px]">
          <button onClick={decreaseFontSize} className="px-[5px] py-[3px] block w-full text-[22px]">-</button>
          <div className="px-[5px] py-[3px] text-center block text-[18px] whitespace-nowrap">
            {getLabel()}
          </div>
          <button onClick={increaseFontSize} className="px-[5px] py-[3px] block w-full text-[22px]">+</button>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="px-[5px] py-[3px] block bg-gray-500 text-white  text-[22px] h-[40px]" ref={toggleButtonRef}>
        A+
      </button>

    </div>
  );
}

export default FontSizeAdjuster;
