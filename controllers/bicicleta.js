var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function (req, res) {
    Bicicleta.allBicis(function (err, bicis) {
        res.render('bicicletas/index', { bicis: bicis });
    });
}

exports.bicicleta_create_get = function (req, res) {
    res.render('bicicletas/create');
}

exports.bicicleta_create_post = function (req, res) {
    var bici = new Bicicleta({ code: req.body.id, color: req.body.color, modelo: req.body.modelo });
    bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.add(bici)

    res.redirect('/bicicletas');
}

exports.bicicleta_update_get = function (req, res, next) {
    Bicicleta.findById(req.params.id, function (err, bici) {
        console.log('UPDATE GET' + bici)
        res.render('bicicletas/update', { errors: {}, bici: bici });
    });
},


    exports.bicicleta_update_post= function(req, res, next) {
    var update_values = { color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng] };
    Bicicleta.findByIdAndUpdate(req.params.id, update_values, function (err, bici) {
        if (err) {
            console.log(err);
            res.render('bicicletas/update', { errors: err.errors, bici: new Bicicleta({ color: req.body.color, modelo: req.body.modelo, ubicacion: [req.body.lat, req.body.lng] }) });
        } else {
            res.redirect('/bicicletas');
            return;
        }
    });
},

exports.bicicleta_delete_post = function (req, res) {
    console.log(req.body.id)
    Bicicleta.findByIdAndDelete(req.body.id, function (err) {
        if (err)
            next(err);
        else
            res.redirect('/bicicletas');
    });

}

