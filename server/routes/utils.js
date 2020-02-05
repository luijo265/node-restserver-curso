const resError = (res, err, code = 400) => {
    return res.status(code).json({
        ok: false,
        err
    })
}

const getQuery = (req) => {

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    return {
        limite,
        desde
    }

}

module.exports = {
    resError,
    getQuery
}