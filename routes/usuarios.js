const express = require('express');
const { check } = require( 'express-validator' );
const router = express.Router();
const usuariController = require('../controllers/usuarioControler');
router.post( '/',
  [
    check( 'nombre', 'El nombre es obligatorio' ).notEmpty(),
    check( 'email', 'Agrega un email válido' ).isEmail(),
    check( 'password', 'El password debe ser de al menos 6 caracteres' ).isLength({ min : 6 }),
  ],
  usuariController.nuevoUsuario
);

module.exports = router;