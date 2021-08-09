// -- ///////////// DEPENDENCIAS /////////////-- // 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios');


// -- ///////////// LOGUEO /////////////-- // 

exports.loginTokenUsuario = async(req,res) => {
    try{
        const { usuario, clave } = req.body;

        if(!usuario || !clave) return res.status(404).json({ Error: 'El Nombre de Usuario y Password es requerido'});

        const result = await Usuarios.findOne({
            where: {
                usuario
            }            
        });        
        if(result.length !== 0){
            const claveCorrecta = await bcrypt.compare(clave, result.clave);
            if(!(result && claveCorrecta)){
                return res.status(401).json({ Error: 'Usuario o Password incorrectos' });
            } else {
                const usuarioToken = {
                    usuario,
                    id: result.id
                }                
                const token = jwt.sign(usuarioToken, process.env.SECRET);                                  
                return res.status(200).json({
                    token, usuario
                });
            }       
        } else {            
            return res.status(404).json({ Error: 'No existe el usuario' });        
        }
    }
    catch(error){        
        return res.status(404).json(error);
    }
}


// -- ///////////// GET TOKEN /////////////-- // 

exports.getToken = req => {
    const authorization = req.get('Authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7);
    }
    return null;
}

// -- ///////////// VALIDAR TOKEN /////////////-- // 

exports.validaToken=async(token)=>{
    const decodedToken = jwt.verify(token, process.env.SECRET) || null;
    
    if(!token || !decodedToken.id){
        return false;
    }
    
    return true;
};

exports.decodificaSecreto=(token)=> jwt.verify(token, process.env.SECRET) || null;