var UserRepository = require('../services/user/UserRepository');
const response = require('../services/http/response.js');
const { check, validationResult } = require('express-validator/check');
const services = new UserRepository();

exports.index = function(req, res, next) {
    services.list().then(users => {
        res.json(response.success(users));
    }).catch(e => next(e));

};

exports.listGroups = function(req, res, next){
    const id = req.params.id;
    services.listGroups(id)
    .then(groups => res.json(response.success(groups)))
    .catch(e => next(e));
}


exports.create = function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(response.error(errors.array()));
    }
    services.create(req.body).then(user => {
        res.json(response.success(user));
    }).catch(e => next(e));
}

exports.update = function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(response.error(errors.array()));
    }

    const id = req.params.id;
    services.update(id, req.body).then(user => {
        res.json(response.success(user));
    }).catch(e => next(e));
}

exports.view = function(req, res, next) {
    const id = req.params.id;
    services.getById(id)
    .then(user => res.json(response.success(user)))
    .catch(e => next(e));
}

exports.delete = function(req, res, next) {
    const id = req.params.id;
    services.delete(id)
    .then(user => res.json(response.success(user)))
    .catch(e => next(e));
}