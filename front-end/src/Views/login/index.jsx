import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Importar el contexto de autenticación
import { useHistory } from 'react-router-dom'; // Para redirigir después del inicio de sesión

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Utilizar el método de inicio de sesión del contexto de autenticación
  const history = useHistory(); // Para redirigir después del inicio de sesión

  const handleLogin = (e) => {
    e.preventDefault();

    // Aquí puedes verificar las credenciales del usuario, por ejemplo, haciendo una petición HTTP a tu servidor
    // Si las credenciales son correctas, entonces puedes llamar a la función de inicio de sesión

    login(); // Esto puede ser más complejo, dependiendo de cómo esté implementado tu inicio de sesión

    // Redirigir al usuario a la página principal (o cualquier otra página) después del inicio de sesión
    history.push('/');
  };

  return (
    <div className="login-container">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
