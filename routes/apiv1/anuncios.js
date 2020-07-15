"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("../../lib/multer");
const Anuncio = mongoose.model("Anuncio");
const fs = require("fs");
var slugify = require("slugify");

router.get("/", (req, res, next) => {
  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 10; // nuestro api devuelve max 10 registros
  const sort = req.query.sort || "-dateCreation";
  const includeTotal = req.query.includeTotal === "true";
  const filters = {};
  if (typeof req.query.tag !== "undefined") {
    filters.tags = req.query.tag;
  }

  if (typeof req.query.venta !== "undefined") {
    filters.venta = req.query.venta;
  }

  if (typeof req.query.precio !== "undefined" && req.query.precio !== "-") {
    if (req.query.precio.indexOf("-") !== -1) {
      filters.precio = {};
      let rango = req.query.precio.split("-");
      if (rango[0] !== "") {
        filters.precio.$gte = rango[0];
      }

      if (rango[1] !== "") {
        filters.precio.$lte = rango[1];
      }
    } else {
      filters.precio = req.query.precio;
    }
  }

  if (typeof req.query.nombre !== "undefined") {
    filters.nombre = new RegExp("^" + req.query.nombre, "i");
  }

  Anuncio.list(filters, start, limit, sort, includeTotal, function (
    err,
    anuncios
  ) {
    if (err) return next(err);
    res.json({ ok: true, result: anuncios });
  });
});

// POST creo anuncio subo la imagen y la guardo
router.post("/", multer.single("foto"), async (req, res, next) => {
  try {
    const anuncioData = req.body;
    // creo la url usando el nombre del anuncio
    console.log(anuncioData);
    anuncioData.url = slugify(anuncioData.nombre).toLowerCase();
    anuncioData.dateCreation = new Date();
    // creamos el objeto en memoria
    const anuncio = new Anuncio(anuncioData);
    console.log(anuncio);

    await anuncio.setFoto(req.file); // save image

    const saved = await anuncio.save();
    res.json({ ok: true, result: saved });
  } catch (err) {
    next(err);
  }
});

// Return the list of available tags
router.get("/tags", function (req, res) {
  res.json({ ok: true, allowedTags: Anuncio.allowedTags() });
});

// GET /api/anuncios/:id
router.get("/findbyid/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;

    const anuncio = await Anuncio.findOne({ _id: _id });
    if (!anuncio) {
      const err = new Error("not found");
      err.status = 404;
      return next(err);
    }
    res.json({ result: anuncio });
  } catch (err) {
    next(err);
  }
});

// GET /api/anuncio/username
router.get("/findbyusername/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    console.log(username);
    const anuncio = await Anuncio.findOne({ username: username });
    if (!anuncio) {
      const err = new Error("not found");
      err.status = 404;
      return next(err);
    }
    res.json({ result: anuncio });
  } catch (err) {
    next(err);
  }
});
// GET /api/anuncio/url
router.get("/findbyurl/:url", async (req, res, next) => {
  try {
    const url = req.params.url;

    const anuncio = await Anuncio.findOne({ url: url });
    if (!anuncio) {
      const err = new Error("not found");
      err.status = 404;
      return next(err);
    }
    res.json({ result: anuncio });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/anuncios
 * Actualiza un anuncio
 */
router.put("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const anuncioData = req.body;
    console.log(anuncioData);
    const anuncioGuardado = await Anuncio.findOneAndUpdate(
      { _id: _id },
      anuncioData,
      {
        returnOriginal: false,
      }
    );
    res.json({ result: anuncioGuardado });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/anuncio
 * Elimina un anuncio
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;

    await Anuncio.deleteOne({ _id: _id });

    res.json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
