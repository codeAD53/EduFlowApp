import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const db_port = parseInt(process.env.DB_PORT,10);
if(isNaN(db_port)){
  throw new Error("DB_PORT must be valid number");
}
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     db_port,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

// Test connection
try{
   pool.connect()
        .then(client =>{
         console.log('Postgresql connected successfully')
         client.release()
        })
        
}catch(error:any){
    console.error("Database Connection Failed",error.message);
    process.exit(1);
}

export default pool