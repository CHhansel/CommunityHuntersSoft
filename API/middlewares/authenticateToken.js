const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si el token ha expirado
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: 'Token de autenticación expirado', codeError: 1 });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ error: 'Token de autenticación inválido', codeError: 2 });
  }
};

module.exports = authenticateToken;

