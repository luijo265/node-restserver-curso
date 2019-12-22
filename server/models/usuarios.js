const mogoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mogoose.Schema

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        required: [true, 'El rol es necesaria'],
        enum: rolesValidos,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
})

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject()
    delete userObject.password

    return userObject

}

// usuarioSchema.method('find', function() {
//     console.log('Pase por aqui');

//     const schema = mogoose.Model('usuarios')

//     let query = {
//         estado: true
//     }

//     return schema.find(query);
// })

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports = mogoose.model('Usuario', usuarioSchema)