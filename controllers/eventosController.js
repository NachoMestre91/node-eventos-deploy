// -- ///////////// DEPENDENCIAS /////////////-- // 

const {Op} = require('sequelize');
const Usuarios = require('../models/Usuarios')
const Eventos = require('../models/Eventos');
const DetallesEventos = require('../models/DetallesEventos');
const loginController= require('../controllers/loginController');

// -- ///////////// LISTAR EVENTOS - UNAUTHORIZED ///////////// -- //

exports.getEventos = async (req, res) => {
    const hoy = new Date();
        dia = hoy.getDate();
        mes = hoy.getMonth();
        anio= hoy.getFullYear();
        fecha_actual = String(anio+"-"+mes+"-"+dia);
        fecha_actual = new Date(fecha_actual);
       

    try {
        const result = await Eventos.findAll({
            
            attributes: ["titulo", "descripcion","localidad", "destacado", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    where: { fecha: {[Op.gte]:fecha_actual} },
                    as: "detallesevento",
                }, 
            ],
            order: [
                ["detallesevento", "fecha", "desc"],
                ["detallesevento", "hora", "desc"],
            ]
        });

        
        

        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existen eventos registrados",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

// -- ///////////// COMPARTIR EVENTO POR ID ///////////// -- //

exports.compartirEvento = async (req, res) => {

    try {
        const { id } = req.body;
        const result = await Eventos.findAll({
            where: {
                id,
            },
            attributes: ["titulo", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
        });        
        if (result.length !== 0) {
            const resultObject = result.map(ro =>{
                return Object.assign({},{
                    titulo: ro.titulo,
                    imagenUrl: ro.imagenUrl,
                    fecha: result[0].detallesevento.fecha
                });                
            });                        
            const respuesta = `Iré al ${resultObject[0].titulo} @ ${resultObject[0].fecha} ${resultObject[0].imagenUrl}`            
            return res.status(200).json(respuesta);
        } else {            
            return res.status(404).json({
                Error: "No existe el evento",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }    
};


// -- ///////////// LSITAR DETALLES POR ID ///////////// -- //

exports.getEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Eventos.findAll({
            where: {
                id,
            },
            attributes: ["titulo", "descripcion", "localidad", "destacado", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
        });
        
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existe el evento",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

// -- ///////////// LISTAR DESTACADOS ///////////// -- //

exports.getEventosDestacados = async (req, res) => {  
    const hoy = new Date();
        dia = hoy.getDate();
        mes = hoy.getMonth()+1;
        anio= hoy.getFullYear();
        fecha_actual = String(anio+"-"+mes+"-"+dia);
        fecha_actual = new Date(fecha_actual);       
        
    try {        
        const result = await Eventos.findAll({
            where: {
                destacado: 1,
            },
            attributes: ["titulo", "descripcion", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    where: { fecha: {[Op.gte]:fecha_actual} },
                    as: "detallesevento",
                },
            ],
            order: [
                ["detallesevento", "fecha", "desc"],
                ["detallesevento", "hora", "desc"],
            ],
        });        
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existen eventos destacados.",
            });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

// -- ///////////// NUEVO EVENTO Y DETALLE - AUTHORIZED //////////// -- //

exports.crearEvento = async (req, res) => {
    const { titulo, descripcion, destacado, imagenUrl, localidad} = req.body;    
    try {
        const token = loginController.getToken(req) || null;
        const decodedToken = loginController.decodificaSecreto(token);
    
        if(!loginController.validaToken(token)){
            return res.status(401).json({ Error: "No se encuentra el token o es inválido" });
        }

        const usuario = await Usuarios.findOne({
            where: {
                id: decodedToken.id
            }
        });
        const nuevoEvento = {
            titulo,
            descripcion,
            destacado,
            imagenUrl,
            localidad,
            usuarioId: usuario.id
        }
        const eventoCreado = await Eventos.create(nuevoEvento);
        if (eventoCreado != null) {
            const eventoId = eventoCreado.id;
            
            arreglo=[]
            req.body.detalles.forEach(async (det)=> {
                const {fecha,hora,precio}=det;
                const nuevaFecha={ fecha,hora,precio,eventoId }
                await DetallesEventos.create(nuevaFecha).then(arreglo.push(nuevaFecha));
            });

            if(arreglo != null) {
                const result = { ...eventoCreado.dataValues,detalle: {arreglo} } 
                return res.status(200).send(result);
            } else {
                return res.status(404).json({ Error: "No se pudo realizar el registro" });
            }
            
        } else {
            return res.status(404).json({ Error: "No se pudo realizar el registro" });
        }
    } catch (error) {
        return res.status(404).json(error);
    }
};

// -- ///////////// EVENTOS POR USUARIO //////////// -- //

exports.getEventosUsuario = async (req, res) => {
 
   
        
    try { 
         
        const token = loginController.getToken(req) || null;
        const decodedToken = loginController.decodificaSecreto(token);    

        if(!loginController.validaToken(token)){
            return res.status(401).json({ Error: "No se encuentra el token o es inválido" });
        }
    
        let pagina = req.params.page;
        const registros = 3;
        if(pagina===undefined){
            pagina = 0;
        } else {
            pagina = Number(pagina);
            if (isNaN(pagina)){
                return res.status(404).json({
                    Error: "Hay un problema con la url.",
                });
            } else {
                pagina = (pagina -1) * registros
            }
        }       
        const result = await Eventos.findAll({
            where: {
                usuarioId: decodedToken.id,
            },
            attributes: ["titulo", "descripcion", "imagenUrl"],
            include: [
                {
                    attributes: ["fecha", "hora", "precio"],
                    model: DetallesEventos,
                    as: "detallesevento",
                },
            ],
            order: [
                ["detallesevento", "fecha", "desc"],
                ["detallesevento", "hora", "desc"],
            ],
            limit: 3,
            offset: pagina
        });
        
        if (result.length !== 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({
                Error: "No existen eventos registrados.",
            });
        }
    } catch (error) {        
        return res.status(404).json(error);
    }
};