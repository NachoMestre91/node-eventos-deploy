//Importamos las dependencias
const express = require('express');
const router = express.Router();

//Importamos los controladores
const eventosController = require('../controllers/eventosController');
const detallesEventosController = require('../controllers/detallesEventosController');
const usuariosController = require('../controllers/usuariosController');
const loginController = require('../controllers/loginController');

// Habilitamos el json parser de express
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//Rutas Eventos
router.get('/eventos',eventosController.getEventos);
router.get('/compartirevento',eventosController.compartirEvento);
router.get('/eventos/:id',eventosController.getEventoById);
router.get('/eventosdestacados/',eventosController.getEventosDestacados);

//Rutas Fecha Eventos
router.get('/detalleseventos',detallesEventosController.getDetalleEventos);
router.post('/detalleseventos',detallesEventosController.createDetalleEvento);


router.get('/usuario/eventos/:page?',eventosController.getEventosUsuario);


//Rutas Usuarios
router.post('/usuario',usuariosController.crearUsuario); //ok

//Rutas Login
router.post('/auth',loginController.loginTokenUsuario); //ok

//Requiere Token
router.post('/eventodetalles',eventosController.crearEvento);//ok

//Rutas desconocidas
const endPointDesconocido = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
router.use(endPointDesconocido);



module.exports = router;