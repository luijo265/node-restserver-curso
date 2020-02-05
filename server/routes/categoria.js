const express = require('express')

let { verificaToken, verificaAdmin_role } = require('../middlewares/authentication')

const { resError } = require('./utils')

const app = express()

let Categoria = require('../models/categorias')

// Crear 5 servicios
// =======================
// Todas las categorias
// =======================
app.get('/categoria', [verificaToken], (req, res) => {

    /*
            //codigo
        })    
    Categoria.find({estado:true},(err, categorias) => {
    */
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'email nombre')
        .exec((err, categorias) => {


            if (err) return resError(res, err, 500)

            res.json({
                ok: true,
                categorias
            })

        })

})

// =======================
// Mostrar una categoria
// =======================
// Categoria.findById
app.get('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id

    Categoria.findById(id, (err, categoria) => {

        if (err) return resError(res, err, 500)

        if (categoria.estado === false) {
            const error = {
                message: 'Categoria no encontrada'
            }
            return resError(res, error, 400)
        }

        res.json({
            ok: true,
            categoria
        })

    })

})

// =======================
// Crear una nueva categoria
// =======================
app.post('/categoria', [verificaToken], (req, res) => {

    let body = req.body

    if (body.descripcion) {

        let categoria = new Categoria({
            descripcion: body.descripcion,
            usuario: req.usuario._id
        })

        categoria.save((err, categoria) => {

            if (err) return resError(res, err, 500)

            res.json({
                ok: true,
                categoria
            })

        })

    } else {
        let err = {
            message: 'Se debe indicar la descripcion de la categoría'
        }
        return resError(res, err, 400)
    }



})

// =======================
// Actualizar una nueva categoria
// =======================
// Solo nombre
app.put('/categoria/:id', [verificaToken], (req, res) => {

    let descripcion = req.body.descripcion

    let id = req.params.id

    if (descripcion) {

        let update = {
            descripcion
        }

        let options = {
            new: true,
            runValidators: true,
        }

        Categoria.findOneAndUpdate({ _id: id, usuario: req.usuario._id }, update, options, (err, categoria) => {

            if (err) return resError(res, err, 500)

            if (!categoria) {

                let e = {
                    message: 'categoria no encontrada'
                }

                return resError(res, e, 400)

            }

            res.json({
                ok: true,
                categoria
            })

        })

    } else {

        let err = {
            message: 'Se debe indicar la descripcion de la categoría'
        }
        return resError(res, err, 400)

    }

})

// =======================
// Remover una nueva categoria
// =======================
// Solo un administrador y pedir token
app.delete('/categoria/:id', [verificaToken, verificaAdmin_role], (req, res) => {

    let id = req.params.id

    let update = {
        estado: false
    }

    let options = {
        new: true,
        runValidators: true,
    }

    let query = {
        _id: id,
        usuario: req.usuario._id,
        estado: true
    }

    Categoria.findOneAndUpdate(query, update, options, (err, categoria) => {

        if (err) return resError(res, err, 500)

        if (!categoria) {

            let e = {
                message: 'categoria no encontrada'
            }

            return resError(res, e, 400)

        }

        res.json({
            ok: true,
            categoria
        })

    })



})


module.exports = app