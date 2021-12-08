import express from 'express';
import Carrito from '../classes/carrito.js';
const router = express.Router();
const carrito = new Carrito();

//GET
router.get('/', (req,res)=>{
    carrito.getAll().then((result)=>{
        res.send(result.product);
        console.log(result.message);
    })
})
router.get('/:id/productos', (req,res)=>{
    const usuarioId = parseInt(req.params.id);
    carrito.getById(usuarioId).then((result)=>{
        res.send(result);
        console.log(result.message);
    })
})

//DELETE
router.delete('/:id', (req,res)=>{
    const carritoId = parseInt(req.params.id);
    carrito.deleteById(carritoId).then((result)=>{
        res.send(result);
        
    })
})
router.delete('/:id/productos/:id_prod', (req,res)=>{
    const idCarrito = parseInt(req.params.id);
    const id_prod = parseInt(req.params.id_prod)
    carrito.deleteProductById(idCarrito,id_prod).then((result)=>{
        res.send(result);
        
    })
})

//POST
router.post('/:id/productos',(req, res)=>{
    const idCarrito = parseInt(req.params.id);
    let idAgregar = req.body;
    carrito.addToCart(idAgregar,idCarrito).then(result=>{
        res.send(result);

    })
})
router.post('/',(req, res)=>{
    let productoAgregar = req.body;
    carrito.saveCart(productoAgregar).then(result=>{
        res.send(result);

    })
})

export default router;