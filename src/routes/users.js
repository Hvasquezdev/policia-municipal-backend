const express = require('express');
const router = express.Router();
const jwtSimple = require('jwt-simple');
const mysqlConnection = require('../database');
const service = require('../../services/index');

// middleware
router.use(express.json());

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

  const { id_user, nombre, apellido, rol, estado, cedula, email, licencia, placa, telefono, pass } = req.body;

  const queryUser = 'INSERT INTO users (ID, nombre, apellido, cedula, email, pass) VALUES (NULL, ?, ?, ?, ?, ?);';
  const queryRol = 'INSERT INTO rol (ID, nombre, estado, users_ID) VALUES (NULL, ?, ?, (SELECT ID FROM users WHERE email = ?));';
  const queryCredentials = 'INSERT INTO credentials (ID, telefono, licencia, placa, users_ID) VALUES (NULL, ?, ?, ?, (SELECT ID FROM users WHERE email = ?));';
  const authEmailQuery = 'SELECT ID FROM users WHERE email = ?';
  const authCedulaQuery = 'SELECT ID FROM users WHERE cedula = ?';
  const authPhoneQuery = 'SELECT ID FROM credentials WHERE telefono = ?';

  mysqlConnection.query(authEmailQuery, [email], (err, results) => {

    if(err) return console.error(err);

    if(results.length > 0) {

      res.status(409).json({'message': 'El email ya esta registrado en la base de datos'});

    } else {

      mysqlConnection.query(authCedulaQuery, [cedula], (err, results) => {

        if(err) return console.error(err);

        if(results.length > 0) {

          res.status(409).json({'message': 'La cedula ya esta registrada en la base de datos'});

        } else {

          mysqlConnection.query(authPhoneQuery, [telefono], (err, results) => {

            if(err) return console.log(err);

            if(results.length > 0) {

              res.status(409).json({'message': 'El numero de telefono ya esta registrado'});
            
            } else {

              mysqlConnection.query(queryUser, [nombre, apellido, cedula, email, pass], (err, results) => {

                if (err) return console.error(err);

                mysqlConnection.query(queryRol, [rol, estado, email], (err, results) => {

                  if (err) return console.log(err);

                  mysqlConnection.query(queryCredentials, [telefono, licencia, placa, email], (err, results) => {

                    if (err) return console.log(err);
                    res.status(200).json({'message': 'Usuario Registrado correctamente'});

                  });

                });
                
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

  const query = 'CALL userAddOrEdit(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
  const authEmailQuery = 'SELECT ID FROM users WHERE email = ? AND ID <> ?';
  const authCedulaQuery = 'SELECT ID FROM users WHERE cedula = ? AND ID <> ?';
  const authPhoneQuery = 'SELECT ID FROM credentials WHERE telefono = ? AND ID <> ?';

  mysqlConnection.query(authEmailQuery, [req.body.data.email, req.body.data.ID], (err, results) => {

    if(err) return console.error(err);

    if(results.length > 0) {

      res.status(409).json({'message': 'El email ya esta registrado en la base de datos'});

    } else {

      mysqlConnection.query(authCedulaQuery, [req.body.data.cedula, req.body.data.ID], (err, results) => {

        if(err) return console.error(err);

        if(results.length > 0) {

          res.status(409).json({'message': 'La cedula ya esta registrada en la base de datos'});

        } else {

          mysqlConnection.query(authPhoneQuery, [req.body.credentials.telefono, req.body.credentials.ID], (err, results) => {

            if(err) return console.log(err);

            if(results.length > 0) {

              res.status(409).json({'message': 'El numero de telefono ya esta registrado'});
            
            } else {

              mysqlConnection.query(query, [req.body.data.ID, req.body.data.nombre, req.body.data.apellido, rol, cedula, email, licencia, placa, telefono, pass], (err, results, fields) => {

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

// Delete user
router.delete('/:id_user', (req, res) => {

  const { id_user } = req.params;
  
  mysqlConnection.query('DELETE FROM users WHERE id_user = ?', [id_user], (err, results) => {

    if (err) return console.error(err);

    res.status(200).json({'message': 'Usuario eliminado correctamente'});

  });

});

module.exports = router;