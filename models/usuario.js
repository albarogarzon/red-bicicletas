var mongoose = require('mongoose')
var Reserva = require('./reserva')

const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const mailer = require('../mailer/mailer');
const Token = require('../models/token');

const saltRounds = 10
var Schema = mongoose.Schema



const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(email)
}

var usuarioSchema = new Schema({

    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El mail es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'La contra es obligatoria']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }

})


usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario' })


usuarioSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds)
    }
    next()
})

usuarioSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}


usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
    var reserva = new Reserva({ usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta, cb: cb })//ver
    console.log(reserva)
    reserva.save(cb)

}

usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return console.log(err.message); }

        const mailOptions = {
            from: 'ottis.wintheiser87@ethereal.email',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '\n'
        };

        mailer.sendMail(mailOptions, function (err, result) {
            if (err) { return console.log(err); }

            console.log('Se ha enviado un email de bienvenida a:  ' + email_destination + '.');
        });
    });

};

usuarioSchema.methods.resetPassword = function (password) {
    //TODO
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return console.log(err.message); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para resetear el password de su cuenta haga click en este link: \n' + 'http://localhost:3000' + '/resetPassword/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function (err, result) {
            if (err) { return console.log(err); }

            console.log('Se ha enviado un email de reseteo de password a:  ' + email_destination + '.');
        });
    });
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log(condition);
    self.findOne({
        $or: [
            { 'googleId': condition.id }, { 'email': condition.emails[0].value }
        ]
    }, (err, result) => {
        if (result) { // login
            callback(err, result);
        } else { // registro
            console.log('---------- CONDITION ----------');
            console.log(condition);
            let values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'SIN NOMBRE';
            values.verificado = true;
            values.password = condition._json.sub;
            console.log('---------- VALUES ----------');
            console.log(values);
            self.create(values, (err, result) => {
                if (err) { console.log(err); }
                return callback(err, result);
            });
        }
    })
};


module.exports = mongoose.model('Usuario', usuarioSchema)