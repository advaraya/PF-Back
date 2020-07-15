"use strict";

module.exports = function (rolesToValidate) {
  return function (req, res, next) {
    // verificar quien pide la página
    if (!req.session.authUser) {
      res.redirect("/login");
      return;
    }

    next();
  };
};
