const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController.js');
const { check, validationResult } = require('express-validator/check');

//listar
router.get('/', groupController.index);

 //listar usuarios
 router.get('/:id/users', groupController.listUsers);

//criar
router.post('/', [
    check('name').isLength({min:5}),
    check('userId').exists().isInt()
  ], groupController.create);

  //alterar
  router.put('/:id', [
    check('name').isLength({min:5}),
  ], groupController.update);

  //visualizar
  router.get('/:id', groupController.view);
 

  //deletar
  router.delete('/:id', groupController.delete);

  //adicionar usuario para grupo
  router.post('/:id/user', [
    check('userId').exists().isInt()
  ], groupController.addUser);

  router.delete('/:id/user',[
    check('userId').exists().isInt()
  ], groupController.removeUserFromGroup);


module.exports = router;