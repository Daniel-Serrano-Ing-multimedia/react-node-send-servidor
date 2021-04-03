const express = require('express');
const { check } = require( 'express-validator' );
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleWare/auth');
router.post( '/',
  [
    check( 'email', 'Usa un email válido' ).isEmail(),
    check( 'password', 'El password es obligatorio' ).notEmpty(),
  ],
  authController.autenticarUsuario
);

router.get( '/',
  auth,
  authController.usuarioAutenticado
);

module.exports = router;