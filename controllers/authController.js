const Usuario = require( '../models/Usuaurio' );
const bcrypt = require( 'bcrypt' );
const { validationResult } = require( 'express-validator' );
const  jwt = require( 'jsonwebtoken' );
//
require('dotenv').config({ path : 'variables.env'});

exports.autenticarUsuario = async ( req, res ) => {
  // Mostrar mensajes de error
  const errors = validationResult( req );
  if( !errors.isEmpty() ){
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  //buscar el usuario
  const usuario = await Usuario.findOne({ email });
  if( !usuario ) return  res.status( 400 ).json({ msg : 'El Usuario no existe' });
  // veriicar password y autenticar usuario
  if( !bcrypt.compareSync( password, usuario.password ) )return res.status( 400 ).json({ msg : 'Password incorrecto' });
  //  crea jwt
    const token = jwt.sign(
      { 
        nombre: usuario.nombre,
        id: usuario._id,
        email: usuario.email
      },  
      process.env.SECRETA, 
      {
      expiresIn : '8h'
    } );
    res.status( 200 ).json({ token  });


}

exports.usuarioAutenticado = async ( req, res ) => {
  if( req.usuario ){ return res.status( 200 ).json({ usuario : req.usuario } ); }
  else{ return res.status( 400 ).json({ error : 'Token invalido' } );  }
}
