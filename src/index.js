const express = require('express');
const expressJwt=require('express-jwt');
const app = express();
const service = require('../services/index');

// secret jwt key
const jwtKey = 'policia_angostura_api_secret_key_venezuela_2018';

// Settings
app.set('port', 3001);

// Middlewares
app.use(express.json());
//app.use(expressJwt({secret: service.SECRET_TOKEN}).unless({path: ['/login', '/signUp']}));

// Set Headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// Routes
app.use(require('./routes/users'));

// Starting Server
app.listen(app.get('port'), () => {
  console.log('Server online on port', app.get('port'));
});





// const express = require('express');
// const jwt = require('jsonwebtoken');

// const app = express();

// // Settings
// app.set('port', process.env.PORT || 3000);

// // Set Headers
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

// app.get('/api', (req, res) => {
//   res.json({
//     message: 'Welcome to the API'
//   });
// });

// app.post('/api/posts', verifyToken, (req, res) => {  
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if(err) {
//       res.sendStatus(403);
//     } else {
//       res.json({
//         message: 'Post created...',
//         authData
//       });
//     }
//   });
// });

// app.post('/api/login', (req, res) => {


//   console.log(req.body);
  

//   // if(user.email !== 'hector@gmail.com' || user.pass !== 'hector1997') {
//   //   res.json({status: 'Usuario o Contraseña incorrectas'});
//   //   return;
//   // }

//   // jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
//   //   res.json({
//   //     user
//   //   });
//   // });
// });

// // FORMAT OF TOKEN
// // Authorization: Bearer <access_token>

// // Verify Token
// function verifyToken(req, res, next) {
//   // Get auth header value
//   const bearerHeader = req.headers['authorization'];
//   // Check if bearer is undefined
//   if(typeof bearerHeader !== 'undefined') {
//     // Split at the space
//     const bearer = bearerHeader.split(' ');
//     // Get token from array
//     const bearerToken = bearer[1];
//     // Set the token
//     req.token = bearerToken;
//     // Next middleware
//     next();
//   } else {
//     // Forbidden
//     res.sendStatus(403);
//   }

// }

// app.listen(app.get('port'), () => {
//   console.log('Server online on port', app.get('port'));
// });