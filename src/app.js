import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import upload from './service/upload.js';
import {productos} from './daos/index.js'
import products from './routes/products.js';
import cart from './routes/cart.js'
import __dirname from './utils.js';
import {Server} from 'socket.io'

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log("Escuchando en puerto " + PORT)
});

export const io = new Server(server);

app.engine('handlebars', engine());
app.set('views',__dirname+'/viewsHandlebars');
app.set('view engine','handlebars');

const admin = true;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Hora de petición: '+time.toTimeString().split(" ")[0],req.method,req.url);
    req.auth = admin;
    next();
})
app.use(express.static(__dirname+'/public'));
app.use('/api/productos',products);
app.use('/api/carritos',cart);


//POST
app.post('/api/uploadfile',upload.single('image'),(req,res)=>{
    const files = req.file; 
    console.log(files);
    if(!files||files.length === 0){
        res.status(500).send({message: 'Error al subir archivo'})
    }
    res.send(files)
})
//VISTA ARTICULOS
app.get('/views/articulos',(req,res)=>{
    productos.getAll().then(result=>{
        let info = result.product;
        let infoObj ={
            productos:info
        }       
        res.render('articulos',infoObj)
    })
})
//RUTA NO AUTORIZAADA
app.use((req,res,next)=>{
    res.status(404).send({error:-1,message:"La ruta que desea ingresar no existe"})
    console.log("La ruta que desea ingresar no existe");
})
//SOCKET
let mensajes = [];
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`);
        socket.emit('log',mensajes);
    let products = await productos.getAll();
        socket.emit('actualiza', products);    
        socket.on('msj', data=>{
            mensajes.push(data)
        io.emit('log',mensajes);
    })
})


