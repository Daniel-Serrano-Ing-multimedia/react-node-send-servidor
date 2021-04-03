// subida de archivos
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
//models
const Enlace = require('../models/Enlace');

exports.subirArchivo = async ( req, res, next ) => {
  // configurar multer
  const confMulter ={ 
    limits : { fileSize : req.usuario ?  1024*1024 * 10 : 1024*1024 },
    storage: fileStorage = multer.diskStorage({
      destination : ( req, file, cb ) => {
        cb( null,  __dirname+'/../uploads' );
      },
      filename : ( req, file, cb) => {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length );
        cb( null, `${ shortid.generate() }${ extension }` );
      },
    })
  }
  
  const upload = multer( confMulter ).single('archivo');

  upload( req, res, async (error) => {
    if( !error ){
      res.status( 200 ).json({ archivo : req.file.filename });
    }else{
      res.status(500).json({ error });
      return next();
    }
  } );
}
// elinar archivo
exports.eliminarArchivo = async ( req, res, next ) => {

  try {
    fs.unlinkSync( __dirname+'/../uploads/'+req.archivo );
  } catch (error) {
    console.log( 'error : ', error );
  }
}

//descargar Archivo
exports.descargar = async ( req, res, next ) => {
  // obtiene el enlace
  const { archivo } = req.params;
  const enlace = await Enlace.findOne({ nombre: archivo });

  const archivoDescarga = __dirname + '/../uploads/'+ archivo;
  res.download( archivoDescarga );

  // extraer de enlace 
  const { descargas, nombre } = enlace;
  // Si las descargas son = 1 Borrar : entrada y archivo
  if( descargas === 1 ){
    // eliminar el archivo 
    req.archivo = nombre;
    // eliminar entrada de la DB
    await Enlace.findOneAndRemove({ nombre });
    next();
    // eliminar enlace DB
  }else{
    // Si las descargas son > 1 restar una descarga
    enlace.descargas --;
    await enlace.save();
  }
}
