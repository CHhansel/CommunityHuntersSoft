import { useState, useEffect } from 'react';
import './ThemeToggle.css'; // Asegúrate de que el CSS está importado correctamente
import sunImage from '../../assets/sun1.svg'; // Cambia a la ruta de tu imagen del sol
import moonImage from '../../assets/moon1.svg'; // Cambia a la ruta de tu imagen de la luna

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Carga el tema guardado al iniciar
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    // Actualiza la clase del body cuando darkMode cambia
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // Guardar preferencia de tema
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>

      <div>
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          onChange={toggleTheme}
          checked={darkMode}
        />
        <label htmlFor="checkbox" className="checkbox-label">
          <img src={darkMode ? sunImage : moonImage} alt="Toggle icon" className="toggle-icon" />
          <span className="ball"></span>
        </label>
      </div>
    </div>
  );
};

export default ThemeToggle;
