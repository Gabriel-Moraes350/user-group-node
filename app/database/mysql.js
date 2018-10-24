const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'usuarios_goomer'
});



connection.connect(function(err){
    if(err) return console.log(err);
    console.log('conectou!');
});


module.exports = connection;
  