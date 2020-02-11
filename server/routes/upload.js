const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuarios')

const { resError } = require('./utils')

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

	let tipo = req.params.tipo
	let id = req.params.id

	if (!req.files || Object.keys(req.files).length === 0) {
	    return resError(res, {message:'No se ha seleccionado ningín archivo'},400)
	}

	// Validar los tipos
	let tiposValidos = ['productos', 'usuarios']

	if (tiposValidos.indexOf( tipo ) < 0) {
		let error = {
			message: 'Los tipos permitidos son ' + tiposValidos.join(', '),

		}
		return resError(res,error, 400)
	}

	let archivo = req.files.archivo;

	// Extension validas
	let extensionesValidas = ['png', 'jpg','gif', 'jpeg']
	let nombreSplit = archivo.name.split('.')
	let extension = nombreSplit[ nombreSplit.length -1 ]

	if ( extensionesValidas.indexOf( extension ) < 0 ) {
		let error = {
			message: 'Las extensiones permitidas son' + extensionesValidas.join(', '),
			ext: extension

		}
		return resError(res,error, 400)
	}

	//Cambiar nombre al archivo
	let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${ extension }`


	archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
	    if (err) return resError(res,err)

	    imagenUsuario(id, res)

/*	    res.json({
	    	ok:true,
	    	message: 'Imagen subida correctamente'
	    })*/
	})


})

function imagenUsuario (id, res){

	Usuario.findById(id, (err, docuemnt) => {

		if( err ) return resError(res,err)

		if (!docuemnt) {
			let error = {
				message: 'Usuario no existe'
			}
			return resError(res,error,400)			
		}

	})

}

module.exports = app