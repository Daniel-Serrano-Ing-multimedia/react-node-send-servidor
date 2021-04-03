const { validationResult } = require( 'express-validator' );
const  jwt = require( 'jsonwebtoken' );

module.exports = async ( req, res, next ) => {
  const authHeader =  req.get( 'Authorization');
  if ( !authHeader ) {
    console.log( 'warning : no hay cabecera de autorizacion' );
    //res.status(400).json({ warning : 'No hay cabecera de autorizacion'  });
    return next();  
  }
  // obtener el token 
  const token = authHeader.split(' ')[1];
  //comporbar el jwt
  try {
    const usuario = jwt.verify( token, process.env.SECRETA );
    req.usuario = usuario;
  } catch (error) {
    //res.status(400).json({ error })
    console.log( '*** error :', error  ,' fin error ***');
  }
  return next();
}
