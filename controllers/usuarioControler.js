const Usuario = require( '../models/Usuaurio' );
const bcrypt = require( 'bcrypt' );
const { validationResult } = require( 'express-validator' );
exports.nuevoUsuario = async ( req, res ) => {
  // Mostrar mensajes de error
  const errors = validationResult( req );
  if( !errors.isEmpty() ){
    return res.status(400).json({ errors: errors.array() });
  }
  //  verificar si el usuario ya estuvo autenticado
  const { email, password } = req.body;;
  let usuario = await Usuario.findOne({ email });
  if ( usuario ){ 
    return res.status(400).json({ msg: 'el usuario ya esta registrado'});
  }
  // crea nuevo usuario
  usuario = new Usuario ( req.body );
  // kash al password
  const salt = await bcrypt.genSalt(10);
  usuario.password  = await bcrypt.hash( password, salt );
  try {
    await usuario.save();
    res.status(200).json({ msg: 'Usuario Creado Correctamente' });
    
  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error', error });
  }

}