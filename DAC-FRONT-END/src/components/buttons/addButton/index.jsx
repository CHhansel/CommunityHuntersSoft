

const AddButton = ({ onClick, icon, altText, textAdditional }) => {
  return (
    <button
      onClick={onClick}
      className="button-add"
      type="submit"
    >
      {icon && <img src={icon} alt={altText || ''} />}
      AGREGAR
    </button>
  );
};

export default AddButton;



