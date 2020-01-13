const resError = (res, err, code = 400) => {
    return res.status(code).json({
        ok: false,
        err
    })
}

module.exports = {
    resError
}