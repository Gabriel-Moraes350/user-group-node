const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const responseService = require('./app/services/http/response');

  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//rotas
app.use('/', require('./app/routes/index.js'));
app.use('/user', require('./app/routes/users.js'));
app.use('/group', require('./app/routes/groups.js'));


app.listen('3000', function () {
    console.log(`app listening on port 3000`)
})


app.use(function(err, req, res, next){
    return res.status(err.status || 500).
    json(responseService.error(err));
});


module.exports = app;