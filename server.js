var express = require('express');
var app = express();
var mongoose = require('mongoose');
var dbUrl = 'mongodb+srv://user:<Password>@cluster0.pbdrpxc.mongodb.net/?retryWrites=true&w=majority';
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


var servidor = app.listen(3000, ()=> {
    console.log("el servidor esta escuchando el puerto", servidor.address().port);
})

app.use(express.static(__dirname))

app.get('/', (req,res) =>{
    res.sendFile(__dirname + '/server.html')
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB conectado exitosamente');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });

var Mensaje = mongoose.model('Mensaje', {nombre: String, mensaje: String})

app.get('/mensajes', async(req,res)=>{
    try {
        var mensaje = await Mensaje.find({});
        res.send(mensaje)
    } catch (err) {
        console.log('Error al obtener los mensajes', err);
        res.sendStatus(500)
    }
})

app.post('/mensajes', async(req,res) =>{
    try {
        var mensaje = new Mensaje(req.body)
        await mensaje.save()
        res.sendStatus(200) 
    } catch (err) {
        console.log('Error al guardar el mensaje', err);
        res.sendStatus(500)
    }
})

io.on('connection', () => {
    console.log('Hay un usuario conectado');
})


