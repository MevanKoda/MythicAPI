import {Pool} from 'pg';
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    //Specify Connection params

    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    port:process.env.DB_PORT,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    max:10,
    connectionTimeoutMillis : 100,
    idleTimeoutMillis : 10
})
export default pool;