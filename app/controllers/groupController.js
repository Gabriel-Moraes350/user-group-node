var GroupServices = require('../services/groupServices');
const response = require('../services/response.js');
const { check, validationResult } = require('express-validator/check');
const services = new GroupServices();

exports.index = function(req, res) {
    services.list().then(groups => {
        res.json(response.success(groups));
    }).catch(e => {res.status(500).json(response.error(e))});

};


exports.create = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(response.error(errors.array()));
    }

    services.create(req.body).then(group => {
        res.json(response.success(group));
    }).catch(e => {res.status(500).json(response.error(e))});
}

exports.update = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(response.error(errors.array()));
    }

    const id = req.params.id;
    services.update(id, req.body).then(group => {
        res.json(response.success(group));
    }).catch(e => {res.status(500).json(response.error(e))});
}

exports.view = function(req, res) {
    const id = req.params.id;
    services.getById(id)
    .then(group => res.json(response.success(group)))
    .catch(e => res.status(500).json(response.error(e)));
}

exports.delete = function(req, res) {
    const id = req.params.id;
    services.delete(id)
    .then(group => res.json(response.success(group)))
    .catch(e => res.status(500).json(response.error(e)));
}

exports.listUsers = function(req, res)
{
    const id = req.params.id;
    services.listUsers(id)
    .then(users => res.json(response.success(users)))
    .catch(e => res.status(500).json(response.error(e)));

}

exports.addUser = function(req, res)
{
    const id = req.params.id;
    services.addUserToGroup(id, req.body)
    .then(save => res.json(response.success(save)))
    .catch(e => res.status(500).json(response.error(e)));
}

exports.removeUserFromGroup = function(req, res)
{
    const id = req.params.id;
    services.removeUserFromGroup(id, req.body)
    .then(save => res.json(response.success(save)))
    .catch(e => res.status(500).json(response.error(e)));
}