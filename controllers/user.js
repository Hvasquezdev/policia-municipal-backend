// const mysqlConnection = require('../src/database');
// const service = require('../services/index');

// function signUp(req, res) {
//   const user = { 
//     nombre: req.body.nombre, 
//     apellido: req.body.apellido, 
//     email: req.body.email, 
//     licencia: req.body.licencia, 
//     placa: req.body.placa, 
//     pass: req.body.pass, 
//     cedula: req.body.cedula 
//   };
//   const query = 'CALL userAddOrEdit(?, ?, ?, ?, ?, ?, ?, ?);';

//   mysqlConnection.query(query, [0, user], (err, results, fields) => {
//     if (err) return console.error(err);
//     res.json({status: 200, token: service.createToken(user)});
//   });
// }

// module.exports = {
//   signUp
// }