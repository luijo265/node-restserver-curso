const express = require('express')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuarios')

const app = express()

const { resError } = require('./utils')

app.post('/login', (req, res) => {

    let body = req.body

    Usuario.findOne({ email: body.email }, (err, document) => {

        if (err) return resError(res, err, 500)

        if (!document) return resError(res, { message: '(Usuario) o contraseña incorrectos' }, 400)

        if (!bcrypt.compareSync(body.password, document.password)) {
            return resError(res, { message: 'Usuario o (contraseña) incorrectos' }, 400)
        }

        let token = jwt.sign({
            usuario: document
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: document,
            token
        })

    })
})

module.exports = app;