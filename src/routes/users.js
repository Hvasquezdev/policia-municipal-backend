const express = require('express');
const router = express.Router();
const jwtSimple = require('jwt-simple');

const mysqlConnection = require('../database');
const service = require('../../services/index');

// middleware
router.use(express.json());

// secret jwt key
const jwtSecretKey = 'policia_angostura_api_secret_key_venezuela_2018';

// Get all users
router.get('/', (req, res) => {

  mysqlConnection.query('SELECT * FROM users', (err, results, fields) => {

    if (err) return console.error(err);

    res.json(results);

  });

});

// Get specific user
router.get('/:id', (req, res) => {

  const { id } = req.params;

  mysqlConnection.query('SELECT * FROM users WHERE ID = ?', [id], (err, results) => {
    
    if (err) return console.error(err);

    if(results[0]) {

      let user = {
        data: results[0],
        rol: {},
        credentials: {}
      };

      mysqlConnection.query('SELECT * FROM rol WHERE users_ID = ?', [id], (err, results) => {

        if(results[0]) {

          user.rol = results[0];

          mysqlConnection.query('SELECT * FROM credentials WHERE users_ID = ?', [id], (err, results) => {

            if(results[0]) {

              user.credentials = results[0];

              res.status(200).json(user);

            }

          });

        }

      });

    } else {

      res.status(404).json('No se encontro al usuario');

    }

  });

});

// Register new user
router.post('/signUp', (req, res) => {

  const { id_user, nombre, apellido, rol, cedula, email, licencia, placa, telefono, pass } = req.body;
  const query = 'CALL userAddOrEdit(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
  const authEmailQuery = 'SELECT ID FROM users WHERE email = ?';
  const authCedulaQuery = 'SELECT ID FROM users WHERE cedula = ?';
  const authPhoneQuery = 'SELECT ID FROM credentials WHERE telefono = ?';

  mysqlConnection.query(authEmailQuery, [email], (err, results) => {

    if(err) return console.error(err);

    if(results.length > 0) {

      res.status(409).end('El email ya esta registrado en la base de datos');

    } else {

      mysqlConnection.query(authCedulaQuery, [cedula], (err, results) => {

        if(err) return console.error(err);

        if(results.length > 0) {

          res.status(409).end('La cedula ya esta registrada en la base de datos');

        } else {

          mysqlConnection.query(authPhoneQuery, [telefono], (err, results) => {

            if(err) return console.log(err);

            if(results.length > 0) {

              res.status(409).end('El numero de telefono ya esta registrado');
            
            } else {

              mysqlConnection.query(query, [id_user, nombre, apellido, rol, cedula, email, licencia, placa, telefono, pass], (err, results, fields) => {

                if (err) return console.error(err);

                res.status(200).json({'message': 'Usuario Registrado correctamente'});
                
              });

            }

          });

        }

      });

    }

  });

});

// Login user
router.post('/login', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const query = 'SELECT * FROM users WHERE email = ? AND pass = ?';
  const queryTwo = 'SELECT * FROM rol WHERE users_ID = ?';
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');

  mysqlConnection.query(query, [email, password], (err, results) => {

    if(!results[0]) {

      res.status(401).json({'message': 'Email o contraseña incorrecta'});

    } else {

      const user_data = results[0];

      mysqlConnection.query(queryTwo, [user_data.ID], (err, results) => {

        const payload = {
          sub: user_data.ID,
          nombre: user_data.nombre,
          email: user_data.email,
          rol: results[0].nombre,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (60 * 1440)
        }

        const token = jwtSimple.encode(payload, service.SECRET_TOKEN);

        res.status(200).json({'token': token});

      });
      
    }

  });

});

// Update user
router.put('/:id_user', (req, res) => {

  const { id_user } = req.params;
  const { nombre, apellido, email, licencia, placa, pass, cedula } = req.body;
  const query = 'CALL userAddOrEdit(?, ?, ?, ?, ?, ?, ?, ?);';

  mysqlConnection.query(query, [id_user, nombre, apellido, email, licencia, placa, pass, cedula], (err, results, fields) => {

    if (err) return console.error(err);

    res.status(200).json({'message': 'Usuario Actualizado'});

  });

});

// Delete user
router.delete('/:id_user', (req, res) => {

  const { id_user } = req.params;
  
  mysqlConnection.query('DELETE FROM users WHERE id_user = ?', [id_user], (err, results) => {

    if (err) return console.error(err);

    res.status(200).json({'message': 'Usuario eliminado correctamente'});

  });

});

module.exports = router;