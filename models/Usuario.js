"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const plainPassword = "1234";
const nodemailer = require("nodemailer");

const usuarioSchema = mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

usuarioSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 10);
};

// en los métodos de instancia no usar arrow functions (pierdes el this de mongoose) --> Esto tiene sentido?
usuarioSchema.methods.sendEmail = function (from, subject, body) {
  // crear transport
  const transport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    },
  });

  // enviar el correo
  return transport.sendMail({
    from: from,
    to: this.email,
    subject: subject,
    html: body,
  });
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
