
import PropTypes from 'prop-types';

const MainInputString = ({ type, placeholder, value, onChange, name }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value || ''}
    onChange={onChange}
    className='px-4 py-2 border border-slate-400'
  />
);

MainInputString.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password']).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default MainInputString;
