const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { check, validationResult } = require('express-validator/check');

//listar
router.get('/', userController.index);

//listar grupos de um usuário
router.get('/:id/groups', userController.listGroups);

//criar
router.post('/', [
    check('email').isEmail(),
    check('name').isLength({min:5}),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
  ], userController.create);

  //alterar
  router.put('/:id', [
    check('email').isEmail(),
    check('name').isLength({min:5}),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
  ], userController.update);

  //visualizar
  router.get('/:id', userController.view);
  //deletar
  router.delete('/:id', userController.delete);


module.exports = router;