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
async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();

    const { name: nombre, email, picture: img } = payload

    return {
        nombre,
        email,
        img,
        google: true
    }

}

app.post('/google', async(req, res) => {

    let body = req.body

    const googleUser = await verify(body.idtoken)
        .catch(e => {
            return resError(res, e, 403)
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return resError(res, e, 500)
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                let error = {
                    message: 'Debe usar su autenticación normal'
                }
                return resError(res, error, 400)
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }

        } else {
            // Siel usuario no existe en la base de datos
            let usuario = new Usuario()

            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = googleUser.google
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return resError(res, err, 500)
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            })

        }

    })

    // res.json({
    //     ok: true,
    //     usuario: googleUser
    // })

});

module.exports = app;