"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Usuario = require("../../models/Usuario");
const bcrypt = require("bcrypt");

// POST /api/usuarios/authenticate
router.post("/authenticate", async (req, res, next) => {
  try {
    //Recoger los parametro de entrada
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    //Buscar el usuario --> Crear un usuario y hacer require model
    const usuario = await Usuario.findOne({ username: username });
    console.log(usuario);
    //Si no existe el usuario o la password no coincide
    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      next(error);
      return;
    }

    //Encuentro el usuario y la password es correcta --> Crear un JWT y luego responder entregandolo

    //crear JWT
    const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    // responder
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
});

// POST /api/usuarios/register

router.post("/register", async (req, res, next) => {
  try {
    //Recoger los parametro de entrada
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    //Buscar el usuario --> Crear un usuario y hacer require model
    const usuario = await Usuario.findOne({ username: username });
    const checkEmail = await Usuario.findOne({ email: email });
    console.log(usuario);
    //Si no existe el usuario o la password no coincide
    if (usuario || checkEmail) {
      const error = new Error("Username or Email already in use");
      error.status = 401;
      next(error);
      return;
    }
    // Crear usuario

    await Usuario.insertMany([
      {
        username: username,
        email: email,
        password: password,
      },
    ]);

    // responder
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Tendria que hacer algo para listar mis usernames que tengo y poder coger uno por id

/**
 * PUT /api/usuarios/:id
 * Actualiza un usuario
 */
router.put("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const usuarioData = req.body;
    console.log(usuarioData);
    const usuarioGuardado = await Usuario.findOneAndUpdate(
      { _id: _id },
      usuarioData,
      {
        returnOriginal: false,
      }
    );
    res.json({ result: usuarioGuardado });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/usuario
 * Elimina un uuario*/
router.delete("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;

    await Usuario.deleteOne({ _id: _id });

    res.json();
  } catch (err) {
    next(err);
  }
});

/*

//Olvido de password
usuario.sendMail(
  process.env.ADMIN_EMAIL,
  "Change password",
  "Cambia tu contraseña aquí"
);*/
module.exports = router;
