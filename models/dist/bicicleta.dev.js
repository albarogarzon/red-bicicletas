"use strict";

var Bicicleta = function Bicicleta(id, color, modelo, ubicacion) {
  this.id = id;
  this.color = color;
  this.modelo = modelo;
  this.ubicacion = ubicacion;
};

Bicicleta.prototype.toString = function () {
  return 'id: ' + this.id + " | color: " + this.color;
};

Bicicleta.allBicis = [];

Bicicleta.add = function (aBici) {
  Bicicleta.allBicis.push(aBici);
};

var a = new Bicicleta(1, 'rojo', 'urbana', [-34, -58]);
var b = new Bicicleta(2, 'verde', 'urbana', [-33, -57]);
Bicicleta.add(a);
Bicicleta.add(b);
module.exports = Bicicleta;