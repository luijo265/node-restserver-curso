const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const { resError } = require('./utils')

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload', function(req, res) {

	if (!req.files || Object.keys(req.files).length === 0) {
	    return resError(res, {message:'No se ha seleccionado ningín archivo'},400)
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
		return resError(res,err, 400)
	}


	archivo.mv(`uploads/{ archivo.name }`, (err) => {
	    if (err)
	      return resError(res,err)

	    res.json({
	    	ok:true,
	    	message: 'Imagen subida correctamente'
	    })
	})


})

module.exports = app