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
  mysqlConnection.query('SELECT * FROM multa WHERE ID = ?' [id], (err, results) => {
    if (err) return console.error(err);
    console.log(results)
    res.json(results);
  });
});

// Registro de nueva multa
router.post('/newMulta', (req, res) => {
  const { nombre, precio, descripcion } = req.body;
  const query = 'INSERT INTO multa (ID, Nombre, Descripcion, Precio) VALUES(NULL, ?, ?, ?);';

  console.log(nombre, precio, descripcion);

  mysqlConnection.query(query, [nombre, descripcion, precio], (err, results) => {
    if (err) return console.error(err);
    res.status(200).json(results);
  });
});

module.exports = router;