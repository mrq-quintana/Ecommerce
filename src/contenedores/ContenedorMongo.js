import mongoose from 'mongoose';
import config from '../config.js'; 


mongoose.connect(config.mongo.url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("Mongodb esta conectado");
    }).catch((error)=>{
    console.log("Mongodb se se ha podido conectar");
    console.log(error);
});;

export default class ContenedorMongo{
    constructor(collection,schema,timestamps){
        this.collection = mongoose.model(collection, new mongoose.Schema(schema,timestamps));

    }
    //READS
    async getAll(){
        try{
            let doc = await this.collection.find();
            if (doc!==[]) {
            return { product: doc, message: "Estos son todos los productos"};
            } else {
            return {message: "No se encontraron productos"};
            }
        } catch (error) {
            return {message: "No se pudo realizar accion" + error};
        }
    }
    async getById(id){
        try{
            let doc = await this.collection.find({_id:id}).populate('productos');
            if (doc) {
            return { product: doc, message: "Id encontrado"};
            } else {
            return {message: "No se pudo encontrar Id "};
            }
        } catch(error){
            return {message: "No se pudo realizar accion " + error};
        }
  
    }
    //DELETES
    async deleteById(id){
        try{
            if(await this.collection.count({_id:id})){
                await this.collection.deleteOne({_id:id});
                return {message: "Item " + id + " eliminado",}; 
            }else{
                return { message: "No hay item para eliminar"};
            }     
        } catch(error){ 
            return {
                message: "No se pudo eliminar " + error};
        }
    }
    async deleteAll(){
        try{
            let doc = await this.collection.find().count();
            if(doc !== 0){
                await this.collection.deleteMany({});
                return { message: "Todos los productos fueron eliminados"};
            }else{
                return { message: "No hay productos para eliminar"};
            }
        } catch(error){ 
            return {
                message: "No se pudo eliminar " + error};
        }
    }
    async deleteProductById(idCarrito,id_prod) {
        try{
            let doc = await this.collection.find({$and:[{_id:idCarrito},{productos:id_prod}]}).count();
            if (doc) {
                let document = await this.collection.updateOne({_id:idCarrito},{$pull:{productos:id_prod}});
                return { product: document, message: "Id encontrado"};
            } else {
                return {message: "No se pudo encontrar Id "};
            }
        } catch(error){
                return {message: "No se pudo realizar accion " + error};
        }
    }
    //CREATES
    async saveProduct(productoAgregar) {
        try {
            let doc = await this.collection.find();
            if (doc.some((i) => i.title === productoAgregar.title)) {
                return { message: 'El producto ' + productoAgregar.title + ' ya existe'};
            } else {
                let producto = await this.collection.create(productoAgregar);
                               await producto.save(); 
            return { product: producto, message: "Producto agregado" };
            }
        } catch (error) {
            return {message: "No se pudo agregar Producto " + error};
        }
    }
    async saveCart() {
        try {
          let cart = await this.collection.insertMany();
          return {message: "Carrito creado con ID "+ cart[0]._id};     
        } catch (error){
            return {message: "No se pudo agregar carrito " + error};
        }
    }
    //UPDATES
    async updateProduct(id, body) {    
        try{
            if(await this.collection.countDocuments({_id:id}) === 1){
                await this.collection.updateOne({_id:id},body);
                return { message: id+" modificado correctamente"};
            }else{
                return { message: "No hay item para modificar"};
            } 
        }catch(error){
            return {message: "No se pudo agregar Producto " + error};
        }
    }
    async addToCart(idAgregar,idCarrito) {
        try{
            if(await this.collection.count({_id:idCarrito})){
             let doc = await this.collection.updateOne({_id:idCarrito},{$push:{productos:idAgregar}});
            return { product:doc, message: "Id agregado correctamente al carrito "+idCarrito+" "};
            }else{
                return { message: "No se puede agregar producto"};
            } 
        }catch(error){
            return {message: "No se pudo agregar Producto " + error};
        }
    }

    
}