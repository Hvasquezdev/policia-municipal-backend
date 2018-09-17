const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'police'
});

mysqlConnection.connect( err => {
  if(err) {
    console.error(err);
    return;
  } else {
    console.log('Connected');
  }
});

module.exports = mysqlConnection;