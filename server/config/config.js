// ======================
// Puerto
// ======================
process.env.PORT = process.env.PORT || 3000

// ======================
// Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ======================
// Vencimiento del token
// ======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30


// ======================
// SEED de autenticacion
// ======================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'

// ======================
// Base de datps
// ======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://admin:admin@node-db:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.urlDB = urlDB


// ======================
// Google cliente
// ======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '92717869073-67re6v65sk58rci97k37fftfnfe87r79.apps.googleusercontent.com'