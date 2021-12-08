import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import upload from './service/upload.js';
import Contenedor from './classes/contenedor.js';
import products from './routes/products.js';
import cart from './routes/cart.js'
import __dirname from './utils.js';
import {Server} from 'socket.io'
import { authAdmin } from './utils.js';

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log("Escuchando en puerto " + PORT)
});
const contenedor = new Contenedor();

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
app.use('/api/carrito',cart);
app.use((req,res,next)=>{
    res.status(404).send({error:-1,message:"La ruta que desea ingresar no existe"})
    console.log("La ruta que desea ingresar no existe");
})

//GET
app.get('/api/productRandom', (req,res)=>{
    contenedor.getRandom().then((result)=>{
        res.send(result.product);
        console.log(result.message);
    })
    
})
//POST
app.post('/api/uploadfile',upload.single('image'),(req,res)=>{
    const files = req.file; 
    console.log(files);
    if(!files||files.length === 0){
        res.status(500).send({message: 'Error al subir archivo'})
    }
    res.send(files)
})
//HANDLEBARS
app.get('/views/articulos',authAdmin,(req,res)=>{
    contenedor.getAll().then(result=>{
        let info = result.product;
        // console.log(info);
        let infoObj ={
            productos:info
        }
        // console.log(infoObj);
        res.render('articulos',infoObj)
    })
})
//SOCKET
let mensajes = [];
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`);
        socket.emit('log',mensajes);
    let products = await contenedor.getAll();
        socket.emit('actualiza', products);    
        socket.on('msj', data=>{
            mensajes.push(data)
        io.emit('log',mensajes);
    })


})


