const jwt = require('jsonwebtoken')
const { resError } = require('../routes/utils')

// ======================
// Verificar Token
// ======================

const verificaToken = (req, res, next) => {

    //req.get es para obtener los headers
    let token = req.get('token')

    // res.json({
    //     ok: true,
    //     token
    // })

    const SEED = process.env.SEED;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) return resError(res, { message: 'Token no válido' })

        req.usuario = decoded.usuario
        next()

    })

}

// ======================
// Verificar Token por medio de url
// ======================

const verificaUrlToken = (req, res, next) => {

    //req.get es para obtener los headers
    let token = req.query.token

    // res.json({
    //     ok: true,
    //     token
    // })

    const SEED = process.env.SEED;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) return resError(res, { message: 'Token no válido' })

        req.usuario = decoded.usuario
        next()

    })

}

// ======================
// Verificar AdminRole
// ======================

let verificaAdmin_role = (req, res, next) => {

    const { role } = req.usuario

    if (role !== 'ADMIN_ROLE') {
        return resError(res, { message: 'El usuario no es administrador' }, 401)
    }

    next()

}


module.exports = {
    verificaToken,
    verificaAdmin_role,
    verificaUrlToken,
}