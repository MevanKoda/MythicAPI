import {Pool} from 'pg';
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    //Specify Connection params
    connectionString: process.env.DATABASE_URL,
    ssl:{rejectUnauthorized:false},
})
export default pool;