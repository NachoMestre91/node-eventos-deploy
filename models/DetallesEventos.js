// -- ///////////// DEPENDENDCIAS /////////////-- // 

const Sequelize = require('sequelize');
const db = require('../config/db');


// -- ///////////// NUEVO USUARIO /////////////-- // 

const DetallesEventos = db.define('detalleseventos', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    fecha:{
        type:Sequelize.DATEONLY,
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'La Fecha del Detalle Evento no puede estar Vacia.'
            },
        }
    },
    hora:{
        type:Sequelize.TIME,
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'La Hora del Detalle Evento no puede estar Vacia.'
            },
        }    
    },
    precio:{
        type:Sequelize.DECIMAL(14,2),
        allowNull:false,
        validate:{
            notEmpty:{
                msg: 'El Precio del Evento no puede estar Vacia.'
            },
        }
    }
});

module.exports = DetallesEventos;