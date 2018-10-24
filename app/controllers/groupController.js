var GroupRepository = require('../services/group/GroupRepository');
const response = require('../services/http/response.js');
const { check, validationResult } = require('express-validator/check');
const services = new GroupRepository();

exports.index = function(req, res, next) {
    services.list().then(groups => {
        res.json(response.success(groups));
    }).catch(e => next(e));

};


exports.create = function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(response.error(errors.array()));
    }

    services.create(req.body).then(group => {
        res.json(response.success(group));
    }).catch(e => next(e));
}

exports.update = function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(response.error(errors.array()));
    }

    const id = req.params.id;
    services.update(id, req.body).then(group => {
        res.json(response.success(group));
    }).catch(e =>  next(e));
}

exports.view = function(req, res, next) {
    const id = req.params.id;
    services.getById(id)
    .then(group => res.json(response.success(group)))
    .catch(e => next(e));
}

exports.delete = function(req, res, next) {
    const id = req.params.id;
    services.delete(id)
    .then(group => res.json(response.success(group)))
    .catch(e => next(e));
}

exports.listUsers = function(req, res, next)
{
    const id = req.params.id;
    services.listUsers(id)
    .then(users => res.json(response.success(users)))
    .catch(e => next(e));

}

exports.addUser = function(req, res, next)
{
    const id = req.params.id;
    services.addUserToGroup(id, req.body)
    .then(save => res.json(response.success(save)))
    .catch(e => next(e));
}

exports.removeUserFromGroup = function(req, res, next)
{
    const id = req.params.id;
    services.removeUserFromGroup(id, req.query)
    .then(save => res.json(response.success(save)))
    .catch(e => next(e));
}