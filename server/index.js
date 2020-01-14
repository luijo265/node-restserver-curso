require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true)

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Habilitar la carpeta public
app.use( express.static( path.resolve( __dirname, '../public/' ) ) )

console.log(path.resolve( __dirname, '..public/' ))

app.use(require('./routes/index'))

mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err, res) => {

    if (err) throw err;
    console.log('Database ONLINE!!');

})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
})