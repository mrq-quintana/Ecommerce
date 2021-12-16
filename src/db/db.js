import knex from "knex";

const db = knex({
    client:'mysql',
    version:'10.4.22',
    connection:{
        host:'127.0.0.1',
        port:3306,
        user:"root",
        password:"",
        database:'base_productos'
    },
    pool: {min:0,max:10}
});

export default db;