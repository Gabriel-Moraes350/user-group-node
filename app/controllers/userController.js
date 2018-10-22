var UserServices = require('../services/userServices');
const response = require('../services/response.js');
const { check, validationResult } = require('express-validator/check');
console.log(UserServices);
const services = new UserServices();

exports.index = function(req, res) {
    services.list().then(users => {
        res.json(response.success(users));
    }).catch(e => {res.status(500).json(response.error(e))});

};

exports.listGroups = function(req, res){
    const id = req.params.id;
    services.listGroups(id)
    .then(groups => res.json(response.success(groups)))
    .catch(e => {res.status(500).json(response.error(e))});
}


exports.create = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(response.error(errors.array()));
    }
    services.create(req.body).then(user => {
        res.json(response.success(user));
    }).catch(e => {res.status(500).json(response.error(e))});
}

exports.update = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(response.error(errors.array()));
    }

    const id = req.params.id;
    services.update(id, req.body).then(user => {
        res.json(response.success(user));
    }).catch(e => {res.status(500).json(response.error(e))});
}

exports.view = function(req, res) {
    const id = req.params.id;
    services.getById(id)
    .then(user => res.json(response.success(user)))
    .catch(e => res.status(500).json(response.error(e)));
}

exports.delete = function(req, res) {
    const id = req.params.id;
    services.delete(id)
    .then(user => res.json(response.success(user)))
    .catch(e => res.status(500).json(response.error(e)));
}