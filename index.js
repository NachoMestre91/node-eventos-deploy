const app = require('./app');
const http = require('http');
const port=process.env.PORT|| 8888;
const host=process.env.HOST||'0.0.0.0';

//const server = http.createServer(app);

//Creamos el Servidor
app.listen(port,host,(req,res)=>{
    console.log('Servidor '+host+' escuchando puerto:'+port);
});