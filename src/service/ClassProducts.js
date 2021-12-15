import database from "../config.js";

export default class ClassProducts{
    constructor(){
        database.schema.hasTable('products').then(result=>{
            if(!result){
                databases.schema.createTable('products',table=>{
                    table.increments();
                    table.string('title').notNullable();
                    table.integer('price').notNullable();
                    table.string('description').notNullable();
                    table.string('codigo').notNullable();
                    table.string('thumbnail').notNullable();
                    table.integer('stock').notNullable();
                    table.timestamps(true,true);
                }).then(result=>{
                    console.log('Tabla prodcts creada')
                })
            }
        })
    }
    getAll = async () =>{
        try{
            let products = await database.select().table('products');
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
            let product = await database.select().table('products').where('id',id).first();
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
            let check = await database.table('products').select().where('title',productoAgregar.title).first();
            if(check) return {status:"error",message:"No se puede agregar el producto ya existe"}
            let result = await database.table('products').insert(productoAgregar)
            return {status:"success",products:`Producto agregado con id: ${result[0]}`}
        }catch(error){
            console.log(error);
            return {status:"error", message:error}
        }
    }

}