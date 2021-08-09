// -- ///////////// DEPENDENDCIAS /////////////-- // 

const Sequelize = require('sequelize');
const db = require('../config/db');

const Usuarios = db.define('usuarios', {
    id:{
        type:Sequelize.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:Sequelize.STRING(40),
        allowNull:false,
        validate: {                        
            notEmpty:{
                msg: 'El Nombre del Usuario no puede estar Vacio.'
            },
            isAlpha: {
                msg: 'El Nombre del Usuario solo puede contener letras.'
            },
        }
    },    
    apellido:{
        type:Sequelize.STRING(40),
        allowNull:false,
        validate: {                        
            notEmpty:{
                msg: 'El Apellido del Usuario no puede estar Vacio.'
            },
            isAlpha: {
                msg: 'El Apellido del Usuario solo puede contener letras.'
            },
        }
    },   
    usuario:{
        type:Sequelize.STRING(40),
        allowNull:false,
        validate: {                        
            notEmpty:{
                msg: 'El Campo Usuario no puede estar Vacio.'
            },
            isAlphanumeric: {
                msg: 'El Campo Usuario solo puede contener letras y numeros.'
            },
        }
    },  
    clave:{
        type:Sequelize.STRING(60),
        allowNull:false,
    }
});

module.exports = Usuarios;