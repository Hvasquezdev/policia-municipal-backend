const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

// middleware
router.use(express.json());

// Recibimos todas las Facturas registradas
router.get('/facturas', (req, res) => {
  let factura = {};
  let user = {};
  let multa = {};
  mysqlConnection.query("SELECT * FROM factura", (err, results) => {
    if (err) return console.error(err);
    if(results) {
      factura = results;

      factura.forEach((element, index, item) => {
        mysqlConnection.query('SELECT * FROM users WHERE ID = ?', [factura[index].users_ID], (err, results) => {
          if (err) return console.error(err);
          user[index] = results[0];
  
            mysqlConnection.query('SELECT * FROM multa WHERE ID = ?', [factura[index].multa_ID], (err, results) => {
              if (err) return console.error(err);
              multa[index] = results[0];
              if(index === item.length-1) {
                const allData = {factura, user, multa};
                res.json(allData);
              }
            });
        });
      });
    }
  });
});

// Recibimos todas las Facturas con pago por confirmar
router.get('/pagosFactura', (req, res) => {
  let factura = {};
  let user = {};
  let multa = {};
  mysqlConnection.query("SELECT * FROM factura WHERE Estado_Factura = 'Pendiente'", (err, results) => {
    if (err) return console.error(err);
    if(results) {
      factura = results;

      factura.forEach((element, index, item) => {
        mysqlConnection.query('SELECT * FROM users WHERE ID = ?', [factura[index].users_ID], (err, results) => {
          if (err) return console.error(err);
          user[index] = results[0];
  
            mysqlConnection.query('SELECT * FROM multa WHERE ID = ?', [factura[index].multa_ID], (err, results) => {
              if (err) return console.error(err);
              multa[index] = results[0];
              if(index === item.length-1) {
                const allData = {factura, user, multa};
                res.json(allData);
              }
            });
        });
      });
    }
  });
});

// Recibimos las facturas que posea el usuario seleccionado
router.get('/facturas/:id', (req, res) => {
  const { id } = req.params; // Parametro recibido por la ruta
  let factura = {};
  let multa = {};
  mysqlConnection.query('SELECT * FROM factura WHERE users_ID = ?', [id], (err, results) => {
    if (err) return console.error(err);
    factura = results;

    factura.forEach((element, index, item) => {
      mysqlConnection.query('SELECT * FROM multa WHERE ID = ?', [factura[index].multa_ID], (err, results) => {
        if (err) return console.error(err);
        multa[index] = results[0];
        if(index === item.length-1) {
          const allData = {factura, multa};
          res.json(allData);
        }
      });
    });
  });
});

// Recibimos las facturas que posea el usuario seleccionado
router.get('/facturasPendiente/:id', (req, res) => {
  const { id } = req.params; // Parametro recibido por la ruta
  let factura = {};
  let multa = {};
  mysqlConnection.query("SELECT * FROM factura WHERE users_ID = ? AND Estado_Factura = 'Pendiente' OR Estado_Factura = 'Activa'", [id], (err, results) => {
    if (err) return console.error(err);
    factura = results;

    factura.forEach((element, index, item) => {
      mysqlConnection.query('SELECT * FROM multa WHERE ID = ?', [factura[index].multa_ID], (err, results) => {
        if (err) return console.error(err);
        multa[index] = results[0];
        if(index === item.length-1) {
          const allData = {factura, multa};
          res.json(allData);
        }
      });
    });
  });
});

// Registra una nueva factura enlanzando el usuario y el tipo de multa a la tabla factura
router.post('/factura', (req, res) => {
  const { tipoMulta, fechaInicio, fechaLimite, mensaje, estado } = req.body.factura;
  const { user } = req.body;
  const fechaLimiteMulta = fechaLimite.dia + '-' + fechaLimite.mes + '-' + fechaLimite.año;
  const query = "INSERT INTO factura (ID, Fecha_Emision, Fecha_Limite, mensaje, Estado_Factura, multa_ID, users_ID) VALUES (NULL, STR_TO_DATE(?, '%d-%m-%Y'), STR_TO_DATE(?, '%d-%m-%Y'), ?, ?, ?, ?);";

  mysqlConnection.query(query, [fechaInicio, fechaLimiteMulta, mensaje, estado, tipoMulta, user], (err, results) => {
    if(err) return console.error(err);
    res.json({message: 'Usuario multado correctamente'});
  });
});

// Actualiza el estado dela factura
router.put('/factura/:id', (req, res) => {
  const query = 'UPDATE factura SET Estado_Factura = ? WHERE ID = ?;'
  const id = req.params.id;
  const estado = req.body.estado;
  
  mysqlConnection.query(query, [estado, id], (err, results) => {
    if(err) return console.error(err);
    res.status(200).json({message: 'Pago verificado'});
  });
});

// Obteniendo comprobante de pago
router.get('/pago/:id', (req, res) => {
  const { id } = req.params; // Parametro recibido por la ruta
  mysqlConnection.query('SELECT * FROM comprobante WHERE users_ID = ?', [id], (err, results) => {
    if (err) return console.error(err);
    res.json(results);
  });
});

// Registrando comprobante de pago
router.post('/pago', (req, res) => {
  const { comprobante, userID, facturaID } = req.body.pago;
  const query = 'INSERT INTO comprobante (ID, comprobante, users_ID, factura_ID) VALUES (NULL, ?, ?, ?);';
  mysqlConnection.query(query, [comprobante, userID, facturaID], (err, results) => {
    if(err) return console.error(err);
    res.json({message: 'Comprobante enviado correctamente'});
  });
});

module.exports = router;