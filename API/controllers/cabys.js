const connection = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de conexión


const searchCabys = (req, res) => {
    const { term } = req.query;

    // Validar que el término de búsqueda esté presente
    if (!term) {
        return res.status(400).json({ error: 'El término de búsqueda es requerido' });
    }

    // Consulta SQL para buscar productos por descripción
    const searchQuery = 'SELECT code, description, tax FROM cabys WHERE description LIKE ? LIMIT 100';
    const searchValues = [`%${term}%`];

    // Ejecutar la consulta en la base de datos
    connection.query(searchQuery, searchValues, (err, results) => {
        if (err) {
            console.error('Error al buscar productos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        res.json({ cabys: results });
    });
};
// Obtener todas las 'cat1desc' únicas
const getAllCat1DescCabys = (req, res) => {
    const query = 'SELECT DISTINCT cat1desc FROM cabys';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener cat1desc:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json({ categories: results });
    });
};

// Obtener todas las 'cat2desc' únicas basadas en un valor 'cat1' proporcionado
const getCat2DescByCat1Cabys = (req, res) => {
    const { cat1 } = req.params;

    // Validar que cat1 esté presente
    if (!cat1) {
        return res.status(400).json({ error: 'Falta cat1 en los parámetros' });
    }

    const query = 'SELECT DISTINCT cat2desc FROM cabys WHERE cat1 = ?';

    connection.query(query, [cat1], (err, results) => {
        if (err) {
            console.error('Error al obtener cat2desc:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json({ subcategories: results });
    });
};
module.exports = {
    searchCabys, getAllCat1DescCabys, getCat2DescByCat1Cabys
};