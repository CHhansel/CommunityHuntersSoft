const jwt = require('jsonwebtoken');

const verifyPermissions = (req, res, next) => {
  const token = req.headers.authorization;
  let user_info_id = req.body.user_info_id; // Intenta obtener el user_info_id del cuerpo de la solicitud

  // Si el user_info_id no se encuentra en el cuerpo, intenta obtenerlo de los parámetros de la URL
  if (!user_info_id && req.query.id) {
    user_info_id = req.query.id;
  }

  // Verificar si se proporcionó el token
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }

  try {
    // Verificar y decodificar el token sin verificar la expiración
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

    // Verificar manualmente si el token ha expirado
    const isTokenExpired = Date.now() >= decoded.exp * 1000;
    if (isTokenExpired) {
      return res.status(498).json({ error: 'Token de autenticación expirado' });
    }
    console.log(decoded.userId, " ",user_info_id);
    // Verificar si el id del usuario en el token coincide con user_info_id en el body
    if (decoded.userId != user_info_id) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    
    req.userId = decoded.userId; // Agregar el ID de usuario decodificado al objeto de solicitud

    next(); // Continuar con la siguiente función de middleware o ruta
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ error: 'Token de autenticación inválido' });
  }
};

module.exports = verifyPermissions;

