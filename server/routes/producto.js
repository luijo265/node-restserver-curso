const express = require('express')

const { verificaToken } = require('../middlewares/authentication')

let app = express()

const Producto = require('../models/productos')
const { resError, getQuery } = require('./utils')

// =======================
// Obtener todos los productos
// =======================
app.get('/productos', (req, res) => {

    // Traer todos los productos
    // populate: usuario categorio
    // paginado

    const { desde, limite } = getQuery(req)

    const query = {
        disponible: true
    }

    Producto.find(query, { __v: 0 })
        .skip(desde)
        .limit(limite)
        .populate('categoria')
        .exec(async(err, productos) => {

            if (err) return resError(res, err, 500)

            let countProductos = await Producto.countDocuments(query)

            res.json({
                ok: true,
                cuantos: countProductos,
                productos
            })

        })


})

// =======================
// Obtener producto por ID
// =======================
app.get('/productos/:id', (req, res) => {

    // populate: usuario categorio
    // paginado

    const { desde, limite } = getQuery(req)

    const query = {
        disponible: true,
        _id: req.params.id
    }

    Producto.findOne(query, { __v: 0 })
        .skip(desde)
        .limit(limite)
        .populate('usuario categoria')
        .exec(async(err, productos) => {

            if (err) return resError(res, err, 500)

            let countProductos = await Producto.countDocuments(query)

            res.json({
                ok: true,
                cuantos: countProductos,
                productos
            })

        })


})

// =======================
// Guardar un producto
// =======================
app.post('/productos', [verificaToken], (req, res) => {

    // grabar el usuario
    // grabar la categoria del listado

    let usuario = req.usuario

    const body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: usuario._id,
    })

    producto.save((err, document) => {

        if (err) return resError(res, err, 500)

        res.json({
            ok: true,
            document
        })

    })

})

// =======================
// Actualizar un producto
// =======================
app.put('/productos/:id', (req, res) => {


})

// =======================
// Eliminar un producto
// =======================
app.put('/productos/:id', (req, res) => {


})


module.exports = app