//models
const Usuario = require( '../models/Usuaurio' );
const Enlace = require( '../models/Enlace' );
const shortid = require('shortid');

const bcrypt = require( 'bcrypt' );
const { validationResult } = require( 'express-validator' );
const  jwt = require( 'jsonwebtoken' );

exports.nuevoEnlace = async ( req, res, next ) =>{
  // Revisar errores
  const errors = validationResult( req );
  if( !errors.isEmpty() ){
    return res.status(400).json({ errors: errors.array() });
  }
  // Crear objeto Enlace
  const { nombre_original, nombre } = req.body;
  enlace = new Enlace();
  enlace.url = shortid();
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;
  enlace.descargas = 1;
  // si el usuario esta autenticado
  if ( req.usuario ){
    const { password, descargas } = req.body;
    if( descargas ){  
      enlace.descargas = descargas;
    }
    if( password ){
      const salt = await bcrypt.genSalt( 10 );
      enlace.password = await bcrypt.hash( password, salt) ;
    }
    enlace.author = req.usuario.id;
  }
  try {
    //Almacenar en DB
    await enlace.save();
    res.status(200).json({ msg : `${ enlace.url }` });
  } catch (error) {
    res.status(500).json({ msg : 'Hubo un error al crear el enace' });
  }
  next();
}

//obtener todos los enlaces en forma de lista
exports.todosEnlaces = async ( req, res, next ) => {
  try {
    const enlaces = await Enlace.find({}).select( 'url -_id' );
    res.status( 200 ).json({ enlaces });
  } catch (error) {
    res.status( 500 ).json({ msg : 'hubo un error' });
  }
}

// verifica si tiene password o no
exports.tienePassword = async ( req, res, next ) =>{
  const { url } = req.params;
  const enlace = await Enlace.findOne({ url });
  // verificar que exista el enlace
  if( !enlace ) return res.status( 404 ).json({ msg: 'Este enlace no existe' });
  
  req.body.enlace = enlace;
  if( enlace.password ) 
    return res.status ( 200 ).json({archivo: enlace.nombre, enlace: enlace.url, password: true });
 
  next();
}

// verificar password
exports.verificarPassword = async ( req, res, next ) => {
  const { password } = req.body;
  const { url } = req.params;
  // 
  const enlace = await Enlace.findOne({ url });
  // verificar password
  if( bcrypt.compareSync( password, enlace.password ) ){
      // permitir descargar el archivo
      req.body.enlace = enlace;
    next();
  }else{
    return res.status( 401 ).json({ msg: 'Password Invalido' });
  }
}

// obtener el Enlace
exports.obtenerEnlace = async ( req, res, next ) =>{
  // verificar que exista el enlace
  const { enlace } = req.body
  if(!enlace) {
    res.status(404).json({msg: 'Ese Enlace no existe'});
    return next();
}
  res.status( 200 ).json({ archivo : enlace.nombre, enlace: enlace.url , password : false });
}
