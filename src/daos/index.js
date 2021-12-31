let productos;
let carrito;
let persistencia ="fileSystem";

switch(persistencia){
    case "fileSystem":
        const {default: ProductosArchivo} = await import('./productos/productosArchivo.js')
        const {default: CarritoArchivo }= await import('./carrito/carritoArchivo.js')
        productos = new ProductosArchivo;
        carrito = new CarritoArchivo;
        break;
        default:
}
export {productos,carrito}