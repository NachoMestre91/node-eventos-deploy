const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const db = require('../config/db');
const Usuarios = require('../models/Usuarios');
const Eventos = require('../models/Eventos');

let headers;
let idEvento1;

describe('creacion de usuarios', () => {  
    test('crear un usuario root', async () => {   
        await Usuarios.destroy({
            where: {}  
          });  
        const nuevoUsuario = {
            nombre: 'usernombre',
            apellido: 'apellidouser',
            usuario: 'User',
            clave: 'root'
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('nuevoUsuario');
    });       
    
    test('crear un usuario con nombre y apellido repetido', async () => {     
        const nuevoUsuario = {
            nombre: 'usernombre',
            apellido: 'apellidouser',
            usuario: 'userdos',
            clave: 'root'
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({Error:'El Nombre y Apellido ya se encuentra registrado'});
    });  

    test('crear un usuario con un nombre de usuario repetido', async () => {     
        const nuevoUsuario = {
            nombre: 'usernombre',
            apellido: 'userapellido',
            usuario: 'usertres',
            clave: 'root'
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({Error:'El Nombre de Usuario ya se encuentra registrado '});
    });

    test('crear un usuario sin enviar nombre', async () => {     
        const nuevoUsuario = {            
            apellido: 'apellidouserdos',
            usuario: 'usercuatro',
            clave: 'roottres',            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:' Nombre, Apellido , Usuario y Password son requeridos'})
    });        

    test('crear un usuario sin enviar apellido', async () => {     
        const nuevoUsuario = {
            nombre: 'nombreusercuatro',            
            usuario: 'usercinco',
            clave: 'rootcinco'            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:' Nombre, Apellido , Usuario y Password son requeridos'})
    });        

    test('crear un usuario sin enviar usuario', async () => {     
        const nuevoUsuario = {
            nombre: 'rootbis',
            apellido: 'rootbis',
            clave: 'rootbis'            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:' Nombre, Apellido , Usuario y Password son requeridos'})
    });        

    test('crear un usuario sin enviar clave', async () => {     
        const nuevoUsuario = {
            nombre: 'usersinpass',
            apellido: 'passinuser',
            usuario: 'usernone'            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:' Nombre, Apellido , Usuario y Password son requeridos'})
    });        
});

describe('login de usuarios', () => {  
    test('permitir login a un usuario correcto', async () => {           
        const nuevoUsuario = {            
            usuario: 'root',
            clave: 'root'
        };
        const res = await api.post('/auth').send(nuevoUsuario);
        headers = {
            'Authorization': `bearer ${res.body.token}`
        };
        console.log(headers)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    });       

    test('no permitir login a un usuario o clave incorrecta', async () => {           
        const nuevoUsuario = {            
            usuario: 'root',
            clave: 'toor'
        };
        const res = await api.post('/auth').send(nuevoUsuario);
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ Error: 'Usuario o Password incorrectos' })
    });     

    test('no hay ningun evento cargado', async () => {
        await Eventos.destroy({
            where: {}  
          });  
        const res = await api.get('/eventos')
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"Error": "No existen eventos registrados"})
    });
        
    test('un usuario logueado puede agregar el evento 1', async () => {
        const nuevoEvento = {
          "titulo":"evento1",
          "descripcion":"descripcion1",
          "destacado":true,
          "imagenUrl":"www.event1.com", 
          "localidad":"san juan",
          "detalles":[
              {
                  "fecha":"2021-08-08",
                  "hora":"21:00",
                  "precio":3000
              },
              {
                  "fecha":"2021-09-08",
                  "hora":"21:00",
                  "precio":3000
              }
          ]
        };
  
        const result = await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);
        idEvento1 = result.body.id
        
    });

    test('un usuario logueado puede agregar el evento 2', async () => {
        const nuevoEvento = {
          "titulo":"event2",
          "descripcion":"descripcion",
          "destacado":false,
          "imagenUrl":"www.event2.com", 
          "localidad":"san juan",
          "detalles":[
              {
                  "fecha":"2022-08-08",
                  "hora":"21:00",
                  "precio":3000
              },
              {
                  "fecha":"2022-09-08",
                  "hora":"21:00",
                  "precio":3000
              }
          ]
        };
  
        await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);
    });

    test('un usuario logueado puede agregar el evento 3', async () => {
        const nuevoEvento = {
          "titulo":"event3",
          "descripcion":"descripcion 3",
          "destacado":false,
          "imagenUrl":"www.event3.com", 
          "localidad":"san juan",
          "detalles":[
              {
                  "fecha":"2020-08-08",
                  "hora":"21:00",
                  "precio":3000
              },
              {
                  "fecha":"2020-09-08",
                  "hora":"21:00",
                  "precio":3000
              }
          ]
        };
  
        await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);  
        
    });

    test('un usuario logueado puede agregar el evento ', async () => {
        const nuevoEvento = {
          "titulo":"event4",
          "descripcion":"descripcion4",
          "destacado":false,
          "imagenUrl":"www.event4.com", 
          "localidad":"san juan",
          "detalles":[
              {
                  "fecha":"2023-08-08",
                  "hora":"21:00",
                  "precio":3000
              },
              {
                  "fecha":"2023-09-08",
                  "hora":"21:00",
                  "precio":3000
              }
          ]
        };
  
        await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);  
        
    });

    test('un usuario logueado lista sus eventos paginados', async () => {
        const res = await api.get('/usuario/eventos').set(headers)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveLength(3);
    });

    test('listado de eventos destacados', async () => {
        const res = await api.get('/eventosdestacados')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveLength(2);
    });

    test('obtener los detalles de un evento 1', async () => {
        console.log(idEvento1)   
        const res = await api.get(`/eventos/${idEvento1}`)
        expect(res.statusCode).toEqual(200);
        const contents = res.body.map(r => r.titulo);
		expect(contents).toContain('primer');
    });

    test('compartir evento en twitter', async () => {    
        console.log(idEvento1)     
        const id = idEvento1 + "";
        const res = await api.get('/compartirevento').send({id: id});        
        expect(res.statusCode).toEqual(200);        
		expect(res.body).toEqual('Iré al primer @ 2021-08-08 www.lalal.com')
    });

    test('listado de eventos ordenados por fecha', async () => {
        const res = await api.get('/eventos')
        expect(res.statusCode).toEqual(200)
        const contents = res.body.map(r => r.titulo);
		expect(contents).toContain('cuarto');
        
    });
});

afterAll(() => {
    db.close();
});