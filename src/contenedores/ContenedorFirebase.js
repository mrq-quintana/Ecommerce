import admin from 'firebase-admin';
import config from '../config.js';


admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL:"https://ecommerce-8868d.firebaseio.com"
})

const db = admin.firestore();

export default class ContenedorFirebase {

    constructor(ruta) {
        this.coleccion = db.collection(ruta)
    }
    //CREATES
    async saveProduct(productoAgregar) {
        try {
            let producto = productoAgregar;
            let doc = await this.coleccion.add(producto);
            let id = doc.id;
            producto.id = id;
            await this.coleccion.doc(doc.id).update(producto);
            return { product: doc.docs, message: "Producto agregado" };
        } catch (error) {
            return {message: "No se pudo agregar Producto " + error};
        }
    }
    async saveCart(productoAgregar){
        try {
            let doc = await this.coleccion.add(productoAgregar);
            return { message: "Carrito creado con id: "+ doc.id };
        } catch (error) {
            return {message: "No se pudo agregar Producto " + error};
        }
    }
    //READS
    async getAll(){
        try{
            let info = await this.coleccion.get();
            let doc = info.docs;
            let documentos = doc.map(documento=>documento.data())
        
            if (documentos !== []) {
                return { product: documentos, message: "Estos son todos los productos"};
            } else {
                return {message: "No se encontraron productos"};
            }
        } catch (error) {
                return {message: "No se pudo realizar accion" + error};
        }
    }
    async getById(id) {
        try{
            let info = await this.coleccion.doc(id).get();
            let doc = info.data();

            if (doc !== undefined) {
                return { product: doc, message: "Estos son todos los productos"};
            } else {
                return {message: "No se encontraron productos"};
            }
        } catch (error) {
                return {message: "No se pudo realizar accion" + error};
        }
    }    
    //DELETES
    async deleteAll(){ //no pude realizarlo por el momento
    }
    async deleteById(id) {
        try{
            let info = await this.coleccion.doc(id).delete();
            console.log(info.docs)
            
            if (info !== undefined) {
                return { product: info, message: "Producto eliminado"};
            } else {
                return {message: "No se encontraron productos"};
            }
        } catch (error) {
                return {message: "No se pudo realizar accion" + error};
        }
    }
    async deleteProductById(idCarrito,id_prod){
        try{
        let doc = await this.coleccion.doc(idCarrito).get();
            console.log(doc.data().productos)
            let document = doc.data();
            let idEncontrado = document.productos.filter(id=>id!==id_prod);
            console.log(idEncontrado)
            document.productos=[];
            document.productos = idEncontrado;
            if (idEncontrado === id_prod) {
                await this.coleccion.doc(idCarrito).set(document);
                return {message: "Se ha eliminado el producto correctamente"};
            } else {
                return {message: "No se encontraron productos para eliminar"};
            }
        } catch (error) {
                return {message: "No se pudo realizar accion" + error};
        }
    }
    //UPDATES
    async updateProduct(id,body){
        try {
            let info = await this.coleccion.doc(id).get();
            let doc = info.data();
            if (doc !== undefined) {
            const doc = await this.coleccion.doc(id).set(body);
                return { message: "Producto actualizado" }
            }else{
                return { message: "No se pudo actualizar producto" }
            }
        } catch (error){
            return { message: "Error al actualizar el producto" }
        }
    }
    async addToCart(idAgregar,idCarrito){
        try{
            let doc = await this.coleccion.doc(idCarrito).get();
            console.log(doc.data().productos)
            let document = doc.data();
            document.productos.push(idAgregar);
            if (doc !== undefined) {
                await this.coleccion.doc(idCarrito).set(document);
                return { product: document, message: "Estos son todos los productos"};
            } else {
                return {message: "No se encontraron productos"};
            }
        } catch (error) {
                return {message: "No se pudo realizar accion" + error};
        }
    }

}
