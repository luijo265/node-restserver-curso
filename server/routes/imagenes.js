const express = require('express')

const fs = require('fs')
const path = require('path')

const { verificaUrlToken } = require('../middlewares/authentication')

let app = express()


app.get('/imagen/:tipo/:img', [verificaUrlToken], (req, res) => {

	let { tipo, img } = req.params

	let imagePath = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`)

	if ( fs.existsSync( imagePath ) ) {

		res.sendFile(imagePath)

	}else{

		res.sendFile(path.resolve(__dirname, '../assets/no-image.png'))

	}


	

})


module.exports = app