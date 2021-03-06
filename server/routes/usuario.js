const express = require('express')

const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuarios')
const { verificaToken, verificaAdmin_role } = require('../middlewares/authentication')

const app = express()

const resError = (res, err) => {
    return res.status(400).json({
        ok: false,
        err
    })
}

app.get('/usuario', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email,
    // })

    // Si viene dato lo carga sino coloca un cero
    let desde = req.query.desde || 0
        // Para transformarlo en numero
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    const query = {
        estado: true
    }

    Usuario.find(query, { __v: 0 })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) return resError(usuarios, err);

            Usuario.countDocuments(query, (err, cuantos) => {
                res.json({
                    ok: true,
                    cuantos,
                    usuarios,
                });

            })


        })

})

app.post('/usuario', [verificaToken, verificaAdmin_role], (req, res) => {
    let body = req.body

    let { nombre, email, password, role } = body;

    let usuario = new Usuario({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        role
    })

    usuario.save((err, document) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: document
        })

    })
})

app.put('/usuario/:id', [verificaToken, verificaAdmin_role], (req, res) => {

    let { id } = req.params;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])


    options = {
        new: true,
        runValidators: true,
    }

    Usuario.findByIdAndUpdate(id, body, options, (err, document) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: document
        })
    })

})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_role], (req, res) => {

    let id = req.params.id

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) return resError(usuarioBorrado)

    // if (!usuarioBorrado) {
    //     res.json({
    //         ok: false,
    //         err: {
    //             message: 'Usuario no encontrado'
    //         }
    //     })
    // }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })

    // })
    options = {
        new: true,
    }

    const query = { _id: id, estado: true }
    Usuario.findOneAndUpdate(query, { estado: false }, options, (err, usuarioBorrado) => {

        if (err) return resError(usuarioBorrado, err)

        if (!usuarioBorrado) {
            return res.json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })
})

module.exports = app;