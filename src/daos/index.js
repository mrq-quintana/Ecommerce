let productos;
let carrito;
let persistencia = 'mongo';

switch (persistencia) {
    case 'fileSystem':
        const { default: ProductosArchivo } = await import('./productos/productosArchivo.js')
        const { default: CarritoArchivo } = await import('./carrito/carritoArchivo.js')
        productos = new ProductosArchivo()
        carrito = new CarritoArchivo()
        break
    case 'mongo':
        const { default: ProductosMongo } = await import('./productos/productosMongo.js')
        const { default: CarritoMongo } = await import('./carrito/carritoMongo.js')
        productos = new ProductosMongo()
        carrito = new CarritoMongo()
        break
    case 'firebase':
        const { default: ProductosFirebase } = await import('./productos/productosFirebase.js')
        const { default: CarritoFirebase } = await import('./carrito/carritoFirebase.js')
        productos = new ProductosFirebase()
        carrito = new CarritoFirebase()
        break
}
export { productos, carrito }