const express = require('express');
const { check } = require( 'express-validator' );
const router = express.Router();
const enlacesController = require('../controllers/enlacesController');
const auth = require('../middleWare/auth');

router.post('/',
  [
    check( 'nombre', 'Sube un archivo' ).notEmpty(),
    check( 'nombre_original', 'Sube un archivo' ).notEmpty()
  ],
  auth,
  enlacesController.nuevoEnlace
);

router.get( '/',
  enlacesController.todosEnlaces
)

router.get('/:url',
    enlacesController.tienePassword,
    enlacesController.obtenerEnlace
);

router.post('/:url',
  enlacesController.verificarPassword,
  enlacesController.obtenerEnlace
);
module.exports = router;