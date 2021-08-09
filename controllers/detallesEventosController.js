// -- ///////////// DEPENDENCIAS /////////////-- // 

const DetallesEventos = require('../models/DetallesEventos');



// -- ///////////// GET DETALLES DE EVENTOS /////////////-- // 

exports.getDetalleEventos = async(req,res,next) => {
   
    try{
        
        const result = await DetallesEventos.findAll({});
        if(result.length !== 0){             
            return res.status(200).json(result);
        } else {            
            return res.status(404).json({                
                Error: 'No hay  eventos con fechas registrados'
            });        
        }
    }
    catch(error){        
        return res.status(404).json(error);
    }
}


// -- ///////////// CREAR DETALLE DE EVENTO /////////////-- // 

exports.createDetalleEvento = async(req,res,next) => {
    const { fecha, hora, precio, id_evento } = req.body;
    try{                        
        const result = await DetallesEventos.create({
            fecha,
            hora,
            precio,            
            id_evento
        }); 
        if(result != null){
            return res.status(200).json(result.dataValues);
        } else {
            return res.status(404).json({                
                Error: 'No se pudo realizar el registro'
            });        
        }
    }
    catch(error){
        return res.status(404).json(error);
    }
}