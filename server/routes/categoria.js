const express = require('express')

let { verificaToken } = require('../middlewares/authentication')

let app = express()

let Categoria = require('../models/categorias')

// Crear 5 servicios
// =======================
// Todas las categorias
// =======================
app.get('/categoria')

// =======================
// Mostrar una categoria
// =======================
// Categoria.findById
app.get('/categoria/:id')

// =======================
// Crear una nueva categoria
// =======================
app.post('/categoria')

// =======================
// Crear una nueva categoria
// =======================
app.post('/categoria')

// =======================
// Actualizar una nueva categoria
// =======================
// Solo nombre
app.put('/categoria')

// =======================
// Remover una nueva categoria
// =======================
// Solo un administrador y pedir token
app.delete('/categoria')


module.exports = app