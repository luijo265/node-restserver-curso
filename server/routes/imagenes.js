const express = require('express')

const fs = require('fs')

let app = express()


app.get('/:tipo/:img', (req, res) => {

	let { tipo, img } = req.params

	let pathImg = `./uploads/${ tipo }/${ img }`

	

})


module.exports = app