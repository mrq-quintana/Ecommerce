import knex from "knex";
import __dirname from "./utils.js";

const database = knex({
    client:'sqlite3',
    connection:{filename: __dirname+'/db/relationaldb.sqlite'}
});

export default database;