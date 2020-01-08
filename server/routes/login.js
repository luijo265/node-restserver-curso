const express = require('express')

const bcrypt = require('bcrypt')

const Usuario = require('../models/usuarios')

const app = express()

const resError = (res) => {
    return res.status(400).json({
        ok: false,
        err
    })
}

app.post('/login', (req, res) => {

	res.json({
        ok: true,
    });
	
})

module.exports = app;