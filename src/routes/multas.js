const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

// middleware
router.use(express.json());


// Get all multas
router.get('/multas', (req, res) => {
  mysqlConnection.query('SELECT * FROM multa', (err, results) => {
    if (err) return console.error(err);
    res.json(results);
  });
});

// Get specific multa
router.get('/multas/:id', (req, res) => {
  const { id } = req.params; // Parametro recibido por la ruta
  const query = 'SELECT * FROM multa WHERE ID = ?';
  mysqlConnection.query(query, [id], (err, results) => {
    if (err) return console.error(err);
    res.json(results);
  });
});

// Registro de nueva multa
router.post('/newMulta', (req, res) => {
  const { nombre, precio, descripcion } = req.body;
  const query = 'INSERT INTO multa (ID, Nombre, Descripcion, Precio) VALUES(NULL, ?, ?, ?);';
  mysqlConnection.query(query, [nombre, descripcion, precio], (err, results) => {
    if (err) return console.error(err);
    res.status(200).json(results);
  });
});

// Actualiza la multa seleccionada
router.put('/multas/:id', (req, res) => {
  const query = 'UPDATE multa SET Nombre = ?, Descripcion = ?, Precio = ? WHERE ID = ?;'
  const id = req.params.id;
  const { Nombre, Precio, Descripcion} = req.body;

  mysqlConnection.query(query, [Nombre, Descripcion, Precio, id], (err, results) => {
    if(err) return console.error(err);
    res.status(200).json({message: 'Multa actualizada'});
  });
});

module.exports = router;