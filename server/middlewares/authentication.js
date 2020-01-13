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

        if (err) return resError(res, { message: 'Token no válido' }, 401)

        req.usuario = decoded.usuario
        next()

    })

}

module.exports = {
    verificaToken
}