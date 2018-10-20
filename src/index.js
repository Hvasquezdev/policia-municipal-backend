const express = require('express');
const expressJwt=require('express-jwt');
const app = express();
const service = require('../services/index');

// Settings
app.set('port', 3001);

// Middlewares
app.use(express.json());
// app.use(expressJwt({secret: service.SECRET_TOKEN}).unless({path: ['/login', '/signUp']}));

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