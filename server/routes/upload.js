const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuarios')
const Producto = require('../models/productos')

const { resError } = require('./utils')

const fs = require('fs')
const path = require('path')

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

		switch( tipo ){
			case 'productos':
				imagenProducto(id, res, nombreArchivo)
				break
			case 'usuarios':
	    		imagenUsuario(id, res, nombreArchivo)
				break
		}


/*	    res.json({
	    	ok:true,
	    	message: 'Imagen subida correctamente'
	    })*/
	})


})

function imagenUsuario (id, res, nombreArchivo){

	Usuario.findById(id, (err, documentDB) => {

		if( err ) return resError(res,err)

		if (!documentDB) {
			borrarImagen(nombreArchivo, 'usuarios')

			let error = {
				message: 'Usuario no existe'
			}
			return resError(res,error,400)			
		}

		if (documentDB.img) {
			borrarImagen(documentDB.img, 'usuarios')
		}

		documentDB.img = nombreArchivo

		documentDB.save((err, productoSave) => {

			if( err ) return resError(res,err)

			res.json({
				ok:true,
				usuario:documentDB,
				img:nombreArchivo
			})

		})


	})

}

function imagenProducto (id, res, nombreArchivo){

	Producto.findById(id, (err, documentDB) => {

		if( err ) return resError(res,err)

		if (!documentDB) {
			borrarImagen(nombreArchivo, 'productos')

			let error = {
				message: 'Usuario no existe'
			}
			return resError(res,error,400)			
		}

		if (documentDB.img) {
			borrarImagen(documentDB.img, 'productos')
		}

		documentDB.img = nombreArchivo

		documentDB.save((err, usuarioSave) => {

			if( err ) return resError(res,err)

			res.json({
				ok:true,
				producto:documentDB,
				img:nombreArchivo
			})

		})


	})

}


function borrarImagen(nombreImagen, tipo){
	let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`)
	if ( fs.existsSync(pathImagen) ) {
		fs.unlinkSync(pathImagen)
	}
}

module.exports = app