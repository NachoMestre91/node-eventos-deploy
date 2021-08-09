const express = require('express');
const app = express();

// Importamos la dependencia dotenv para configurar las variables de entrono
require('dotenv').config();


const db = require('./config/db');

db.authenticate()
.then(()=>{
      db.sync()
   /*.then(() => */ console.log('Conectado al Servidor Mysql')
    /* .catch(error => console.log(error.message)); */
})
.catch((error)=>console.log(error.message))

const routes = require('./routes/index');
app.use('/', routes);

module.exports = app;

