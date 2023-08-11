import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectStatus } from '../../store/authSlice/authSlice';

function LoginComponent() {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);

  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = () => {
    // Llama a la acción de inicio de sesión con las credenciales
    dispatch(loginUser(credentials));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button onClick={handleLogin}>Login</button>
      {status === 'checking' && <p>Logging in...</p>}
      {status === 'authenticated' && <p>Logged in successfully!</p>}
      {status === 'not-authenticated' && <p>Failed to log in.</p>}
    </div>
  );
}

export default LoginComponent;
