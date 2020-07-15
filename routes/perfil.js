"use strict";
const router = require("express").Router();
const fs = require("fs");
const Usuario = require("mongoose").model("Usuario");

//GET página de perfil de usuario

/*{
    username: "myusername",
    email: "user@example.es",
    password: await Usuario.hashPassword("1234"),
  },*/

/*El perfil usuario va a tener su:
  - id (que no puede cambiar) 
  - username (Puede cambiarlo) db.collection.update(query, update, options)
  - email (Puede cambiarlo) db.collection.update(query, update, options)
  - password (Puede cambiarlo) db.collection.update(query, update, options)
  - listado de anuncios
  - página de usuario, con una pequeña descripción
  - Va a mostrar la url del perfil de usuario donde podrán ver el usuario anonimo todos los anuncios de este
  */

//POST donde se van a actualizar los datos de usuario
