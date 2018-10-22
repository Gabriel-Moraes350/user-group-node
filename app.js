const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//middleware
// app.use(function(err, req, res, next){
//     return res.status(500).json({'error': err, 'date': new Date(), 'success':false, 'data':''});
// });

//rotas
app.use('/', require('./app/routes/index.js'));
app.use('/user', require('./app/routes/users.js'));
app.use('/group', require('./app/routes/groups.js'));


app.listen('3000', function () {
    console.log(`app listening on port 3000`)
})
module.exports = app;