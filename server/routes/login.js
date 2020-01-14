const express = require('express')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de google
async function verify( token ) {

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();

    console.log(payload.name)
    console.log(payload.email)
    console.log(payload.picture)

}

app.post('/google', (req, res) => {

    let body = req.body

    verify(body.idtoken)
        .catch( console.log )

    res.json({
        ok:true,
        body
    })

});

module.exports = app;