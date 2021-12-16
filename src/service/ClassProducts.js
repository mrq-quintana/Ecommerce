import { db } from "../config.js";

export default class ClassProducts{
    constructor(){
        db.schema.hasTable('products').then(result=>{
            if(!result){
                db.schema.createTable('products',table=>{
                    table.increments();
                    table.string('title').notNullable();
                    table.integer('price').notNullable().defaultTo(0);
                    table.string('description').notNullable();
                    table.string('codigo').notNullable();
                    table.string('thumbnail');
                    table.integer('stock').notNullable().defaultTo(0);
                    table.timestamps(true,true);
                }).then(result=>{
                    console.log('Tabla products creada')
                })
            }
        })
    }
    getAll = async () =>{
        try{
            let products = await db.select().table('products');
            return {
                status:"succes",
                products: products,
                message: "Estos son todos los productos",
              };
        } catch(error){
            return {
                status:"error",
                message: error,
              };
        }
    }
    getById = async (id) =>{
        try{
            let product = await db.select().table('products').where('id',id).first();
            if(product){
                return {status:"success",products:product}
            }else{
                return {status:"error",message:"Producto no encontrado"}
            }
        }catch(error){
            return {status:"error",message:error}
        }
    }
    saveProduct = async (productoAgregar) =>{
        try{
            let check = await db.table('products').select().where('title',productoAgregar.title).first();
            if(check) return {status:"error",message:"No se puede agregar el producto ya existe"}
            let result = await db.table('products').insert(productoAgregar);
            return {status:"success",message:`Producto agregado con id: ${result[0]}`}
        }catch(error){
            console.log(error);
            return {status:"error", message:error}
        }
    }
    updateProduct = async (id,body) =>{
        try{
            let product = await db.table('products').where('id',id).update(body);
            if(!product) {return {status:"error",message:"No se puede actualizar, el producto no existe"}
            } else {return {status:"success",message:`Producto actualizado con exito`}}
        }catch(error){
            console.log(error);
            return {status:"error", message:error}
        }
    }
    deleteById = async (id) =>{
        try{
            let product = await db.select().table('products').del().where('id',id);
            if(product){
                return {status:"success",products:product}
            }else{
                return {status:"error",message:"Producto no encontrado"}
            }
        }catch(error){
            return {status:"error",message:error}
        }
    }
    deleteAll = async () =>{
        try{
            let products = await db.select().table('products').del();
            return {
                status:"succes",
                products: products,
                message: "Todos los productos fueron eliminado",
              };
        } catch(error){
            return {
                status:"error",
                message: error,
              };
        }
    }

}