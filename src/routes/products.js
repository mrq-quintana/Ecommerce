import express from 'express';
import upload from '../service/upload.js';
import Contenedor from '../classes/contenedor.js';
import ClassProducts from '../service/classProducts.js';
import { io } from '../app.js';
import { authAdmin } from '../utils.js'
const router = express.Router();
const contenedor = new Contenedor();
const products = new ClassProducts();

//GET
router.get('/', (req,res)=>{
    products.getAll().then((result)=>{
        res.send(result);
        console.log(result.message);
    })
})
router.get('/:id', (req,res)=>{
    const id = parseInt(req.params.id);
    products.getById(id).then((result)=>{
        res.send(result);
        console.log(result.message);
    })
})
//POST
router.post('/',authAdmin,upload.single('image'),(req, res)=>{
    let productoAgregar = req.body;
    productoAgregar.price = parseInt(productoAgregar.price);
    console.log(req);
    let thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+req.file.filename;
    productoAgregar.thumbnail = thumbnail;
    products.saveProduct(productoAgregar).then(result=>{
        res.send(result);
        if(result){
            products.getAll().then(result=>{
                io.emit('actualiza',result);
            })
        }
    })
})
//DELETE
router.delete('/:id',authAdmin,(req,res)=>{
    const usuarioId = parseInt(req.params.id);
    contenedor.deleteById(usuarioId).then((result)=>{
        res.send(result.product);
        console.log(result.message);
    })
})
//PUT
router.put('/:pid',authAdmin,(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.pid);
    contenedor.updateProduct(id,body).then(result=>{
        res.send(result);
        console.log(result.message);
    })
})

export default router;