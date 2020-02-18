const express = require('express')

const fs = require('fs')
const path = require('path')

let app = express()


app.get('/imagen/:tipo/:img', (req, res) => {

	let { tipo, img } = req.params

	let pathImg = `./uploads/${ tipo }/${ img }`

	let imagePath = path.resolve(__dirname, '../uploads/${ tipo }/${ img }')

	if ( fs.existsSync( imagePath ) ) {

		res.sendFile(imagePath)

	}else{

		res.sendFile(path.resolve(__dirname, '../assets/no-image.png'))

	}


	

})


module.exports = app