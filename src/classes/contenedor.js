import fs from 'fs';
import __dirname from '../utils.js';

const rutaProductos = __dirname+'/files/products.txt'

class Contenedor {
  async saveProduct(productoAgregar) {
    try {
      let info = await fs.promises.readFile(rutaProductos, "utf-8");
      let infoJson = JSON.parse(info);

      if (infoJson.some((i) => i.title === productoAgregar.title)) {
        return {
          message: 'El producto ' + productoAgregar.title + ' ya existe'
        };
      } else {
        let timestamp = Date.now();
        let time = new Date(timestamp);
        let productos = {
          id: parseInt(infoJson.length + 1),
          timestamp: time.toLocaleDateString() +" , "+ time.toTimeString().split(" ")[0],
          title: productoAgregar.title,
          price: productoAgregar.price,
          description: productoAgregar.description,
          codigo:productoAgregar.codigo,
          stock:productoAgregar.stock,
          thumbnail :productoAgregar.thumbnail,
        };

        infoJson.push(productos);

        try {
          await fs.promises.writeFile(rutaProductos, JSON.stringify(infoJson, null, 2));
          return {
            message: "Producto agregado"
          };
        } catch (error) {
          return {
            message: "No se pudo agregar Producto " + error
          };
        }
      }
    } catch (error) {
      let productos = {
        id: 1,
        timestamp: time.toLocaleDateString() +" , "+ time.toTimeString().split(" ")[0],
        title: productoAgregar.title,
        price: productoAgregar.price,
        description: productoAgregar.description,
        codigo:productoAgregar.codigo,
        stock:productoAgregar.stock,
        thumbnail :productoAgregar.thumbnail,
      };

      try {
        await fs.promises.writeFile(rutaProductos, JSON.stringify([productos]), null, 2);
        return { prod: productos, message: "Producto agregado ya" };
      } catch (error) {
        return {
          message: "No se pudo agregar Producto " + error,
        };
      }
    }
  }
  async getById(id) {
    let info = await fs.promises.readFile(rutaProductos, "utf-8");
    let infoJson = JSON.parse(info);
    let infoId = infoJson.find((i) => i.id === id);

    if (infoId) {
      return { product: infoId, message: "Id encontrado" };
    } else {
      return {
        message: "No se pudo encontrar Id ",
      };
    }
  }
  async getAll() {
    let info = await fs.promises.readFile(rutaProductos, "utf-8");
    let infoJson = JSON.parse(info);

    if (infoJson !== []) {
      return {
        product: infoJson,
        message: "Estos son todos los productos",
      };
    } else {
      return {
        product: "",
        message: "No se encontraron productos",
      };
    }
  }
  async deleteById(id) {
    let info = await fs.promises.readFile(rutaProductos, "utf-8");
    let infoJson = JSON.parse(info);
    let infoId = infoJson.filter((i) => i.id !== id);
    let infoIdEliminado = infoJson.filter((i) => i.id === id);

    if (infoJson.find((i) => i.id === id)) {
      await fs.promises.writeFile(
        rutaProductos,
        JSON.stringify(infoId, null, 2)
      );
      return {
        product: infoIdEliminado,
        message: "Producto " + id + " eliminado",
      };
    } else {
      return {
        product: infoId,
        message: "No existe producto para eliminar",
      };
    }
  }
  async getRandom() {
    let info = await fs.promises.readFile(rutaProductos, "utf-8");
    let infoJson = JSON.parse(info);
    let idRandom = (Math.ceil(Math.random() * infoJson.length)).toString();

    let infoId = infoJson.filter((i) => i.id === idRandom);

    if (infoId) {
      return { product: infoId, message: "Id random encontrado" };
    } else {
      return {
        message: "No se pudo aencontrar Id ",
      };
    }

  }
  async deleteAll() {
    let info = await fs.promises.readFile(rutaProductos, "utf-8");
    let infoJson = JSON.parse(info);

    if (infoJson !== []) {
      fs.promises.writeFile(
        rutaProductos,
        JSON.stringify((infoJson = []), null, 2)
      );
      return {
        message: "Todos los productos fueron eliminados",
      };
    }
  }
  async updateProduct(id, body) {
    let info = await fs.promises.readFile(rutaProductos, 'utf-8');
    let infoJson = JSON.parse(info);
    let infoId = infoJson.find((i) => i.id === id);
    if (infoId) {
      if (id) {
        infoJson.forEach((product) => {
          if (id === product.id) {
            product.title = body.title,
              product.price = body.price,
              product.image = body.image
          }
        })
        try {
          await fs.promises.writeFile('./files/products.txt', JSON.stringify(infoJson, null, 2));
          return { message: "Producto actualizado" }
        } catch {
          return { message: "Error al actualizar el producto" }
        }
      }
    }
    else {
      return { message: "No se encontro id para actualizar el producto" }
    }
  }
}

export default Contenedor;
