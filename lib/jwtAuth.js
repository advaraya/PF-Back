"use strict";

//middelware de comprobación de JWT

const jwt = require("jsonwebtoken");

module.exports = function () {
  return (req, res, next) => {
    //Recoger el token de la petición
    const token = req.get("Authorization") || req.query.token || req.body.token;
    console.log(req.body);
    //Si no nos dan token no pueden pasar
    if (!token) {
      const error = new Error("no token provided");
      error.status = 401;
      next(error);
      return;
    }
    //Verificar que el token es valido
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        const err = new Error("invalid token");
        err.status = 401;
        next(err);
        return;
      }
      console.log("Well done!");
      req.apiAuthUserId = payload._id;
      next();
    });
  };
};
