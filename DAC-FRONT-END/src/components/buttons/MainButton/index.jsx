
import PropTypes from 'prop-types';

const MainButton = ({ onClickFunction, label }) => {
  return (
    <button className="px-8 py-2 bg-main-color text-secondary-color" onClick={onClickFunction}>{label}</button>
  );
};

MainButton.propTypes = {
  onClickFunction: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default MainButton;

