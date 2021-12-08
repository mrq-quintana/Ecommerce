import fs from 'fs';
import __dirname from '../utils.js';

const rutaProductos = __dirname+'/files/products.txt'
const rutaCarrito = './src/files/carrito.txt'

class Carrito {
    async saveCart(productoAgregar) {
      try {
        let cart = await fs.promises.readFile(rutaCarrito, "utf-8");
        let cartJson = JSON.parse(cart);
        let info = await fs.promises.readFile(rutaProductos, "utf-8");
        let infoJson = JSON.parse(info);
        let idProducto = [];
        productoAgregar.id.forEach(element => { 
          idProducto.push(infoJson.find(i=> i.id===element))
        }); 
          if (!idProducto) {
            return {message: 'El producto no se puede agregar al carrito'};
          }else{
            let timestamp = Date.now();
            let time = new Date(timestamp);
            let carrito = {
              idCarrito: parseInt(cartJson.length + 1),
              timestamp: time.toLocaleDateString() +" , "+ time.toTimeString().split(" ")[0],
              productos: idProducto
            };    

            cartJson.push(carrito);   
                try {
                  await fs.promises.writeFile(rutaCarrito, JSON.stringify(cartJson, null, 2));
                  return {message: `Carrito creado con Id ${carrito.idCarrito}`};
                  } 
                catch (error){
                  return {message: "No se pudo agregar producto " + error};
                }
          }
        } 
        catch (error){
          console.log(error)
      }
    }
    async addToCart(idAgregar,idCarrito){
      let cart = await fs.promises.readFile(rutaCarrito, "utf-8");
      let cartJson = JSON.parse(cart);
      let info = await fs.promises.readFile(rutaProductos, "utf-8");
      let infoJson = JSON.parse(info);
      
      let cartId = cartJson.find((i) => i.idCarrito === idCarrito);

      if (cartId){  
       idAgregar.id.map(id => { 
            let idAdd= infoJson.find(i=> i.id===id)
              if(idAdd!==undefined){
                cartId.productos.push(idAdd);}
        });


          await fs.promises.writeFile(rutaCarrito, JSON.stringify(cartJson, null, 2));

          return { message: "Id agregado correctamente al carrito "+idCarrito+" "};
        
      }else{
        return { message: "El carrito no existe "};
      }

      }
    async getAll() {
      let info = await fs.promises.readFile(rutaCarrito, "utf-8");
      let infoJson = JSON.parse(info);
  
      if (infoJson !== []) {
        return {
          product: infoJson,
          message: "Estos son todos los productos del carrito",
        };
      } else {
        return {
          product: "",
          message: "No se encontraron productos en su carrito",
        };
      }
    }
    async getById(id) {
      let info = await fs.promises.readFile(rutaCarrito, "utf-8");
      let infoJson = JSON.parse(info);
      let infoId = infoJson.find((i) => i.idCarrito === id);
  
      if (infoId) {
        return { product: infoId.productos, message: "Id de carrito encontrado" };
      } else {
        return {
          message: "No se pudo encontrar carrito con ese Id ",
        };
      }
    }
    async deleteById(id) {
      let info = await fs.promises.readFile(rutaCarrito, "utf-8");
      let infoJson = JSON.parse(info);
      let infoId = infoJson.filter((i) => i.idCarrito !== id);
      let infoIdEliminado = infoJson.filter((i) => i.id === id);
  
      if (infoJson.find((i) => i.idCarrito === id)) {
        await fs.promises.writeFile(rutaCarrito, JSON.stringify(infoId, null, 2));
        return {
          product: infoIdEliminado,
          message: "Carrito con Id " + id + " eliminado",
        };
      } else {
        return {
          message: "No existe el carrito para eliminar",
        };
      }
    }
    async deleteProductById(idCarrito,id_prod) {
      let info = await fs.promises.readFile(rutaCarrito, "utf-8");
      let infoJson = JSON.parse(info);
      let infoId = infoJson.find((i) => i.idCarrito === idCarrito);
      if(infoId){
          let productoEliminado = infoId.productos.filter((i) => i.id !== id_prod);
          let productoIdencontrado = infoId.productos.find((i) => i.id === id_prod);
          if(!productoIdencontrado){
            return {
              message: "No existe el producto en el carrito",  
            };
          }else{
            infoId.productos=[...productoEliminado];
            await fs.promises.writeFile(rutaCarrito, JSON.stringify(infoJson, null, 2));
            return {
              message: "Producto con id "+id_prod+" eliminado del carrito con id " + idCarrito +"",
            };
          }
      } else {
        return {
          message: "No existe el carrito",  
        };
      }
    }

    
}
export default Carrito;