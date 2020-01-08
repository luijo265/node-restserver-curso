require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'))

console.log('process.env.urlDB', process.env.urlDB);
mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {

    if (err) throw err;
    console.log('Database ONLINE!!');

})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
})