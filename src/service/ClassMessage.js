import { database } from "../config.js";

export default class ClassMassage{
    constructor(){
        database.schema.hasTable('message').then(result=>{
            if(!result){
                database.schema.createTable('message',table=>{
                    table.string('usuario').notNullable();
                    table.string('mensaje');
                    table.timestamps(true,true);
                }).then(result=>{
                    console.log('Tabla de mansajes creada')
                })
            }
        })
    }

    getMessage = async ()=>{
        let message = await database.select().table('message');
        return {
            mensajes:message
        }
    }
    saveMessage = async (chat) =>{
        try{
            await database.select().table('message').insert(chat);
            return {status:"success",message:`Mensaje enviado`}
        }catch(error){
            console.log(error);
            return {status:"error", message:error}
        }
    }
}