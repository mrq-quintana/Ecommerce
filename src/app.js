import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import upload from './service/upload.js';
import {productos, usuario, sesion , mensajes} from './daos/index.js' 
import session from "express-session";
import MongoStore from "connect-mongo";
import products from './routes/products.js';
import cart from './routes/cart.js'
import __dirname from './utils.js';
import {Server} from 'socket.io';
import ios from 'socket.io-express-session';



const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>{
    console.log("Escuchando en puerto " + PORT)
});


const baseSession = (session({
    store:MongoStore.create({mongoUrl:'mongodb+srv://Maxi:123@ecommerce.dgoa9.mongodb.net/Ecommerce?retryWrites=true&w=majority'}),
    secret:"CoderChat", 
    resave:true,
    cookie:{maxAge:6000},
    saveUninitialized:false,
}))

export const io = new Server(server);

const admin =true;

app.engine('handlebars', engine());
app.set('views',__dirname+'/viewsHandlebars');
app.set('view engine','handlebars');
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
app.use(baseSession);
io.use(ios(baseSession));
app.use(express.static(__dirname+'/public'));
app.use('/api/productos',products);
app.use('/api/carritos',cart);


//SUBIR IMAGEN
app.post('/api/uploadfile',upload.single('image'),(req,res)=>{
    const files = req.file; 
    console.log(files);
    if(!files||files.length === 0){
        res.status(500).send({message: 'Error al subir archivo'})
    }
    res.send(files)
})
//SESION USUARIO
app.get('/currentUser',(req,res)=>{
    if(req.session.user){
        res.send(req.session.user)
    }else{
        res.send({error: -2})
    }
})

//REGISTRO DE USUARIO
app.post('/api/register', async (req,res)=>{
    let user = req.body;
    let result = await usuario.saveUser(user);
    res.send(result)
})

//LOGIN USUARIO
app.post('/api/login', async (req,res)=>{
    let {email,password} = req.body;
    let user = await usuario.getByUser({email:email,password:password});
    if(user.status===200){
        req.session.user={
            username:user.user.usuario,
            email:user.user.email,
            role:"empleado"
        }
        return res.send({message:'Bienvenido ' + req.session.user.username +' logueado correctamente'})
    }
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
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`);
    let products = await productos.getAll();

    socket.emit('actualiza', products); 
    socket.on('msj', async data=>{
        let user = await usuario.getBy(socket.handshake.session.user.username)
        console.log(user)
        let mjs = {
            user:user.user._id,
            usuario:user.user.usuario,
            message: data.message
        }
            await mensajes.saveMessage(mjs);
        const textos = await mensajes.getAll();
        console.log(textos.product)
        io.emit('log',textos.product); 

        })
})


