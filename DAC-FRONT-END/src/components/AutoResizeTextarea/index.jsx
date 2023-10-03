import { useRef, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const AutoResizeTextarea = ({ value, onChange, className, isEditable }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  }, [value]); 

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className={className}
      disabled={!isEditable}
      style={{ overflowY: 'hidden', resize: 'none' }}
    />
  );
};

export default AutoResizeTextarea;

