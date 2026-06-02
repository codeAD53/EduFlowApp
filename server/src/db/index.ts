import { Pool } from 'pg'

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

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000 //Prevent hanging and better scalability
})

// Test connection

   pool.connect()
        .then(client =>{
         console.log('Database connected successfully .....')
         client.release()
        })
        
.catch((error:unknown)=>{
      console.error("Database Connection Failed",error instanceof Error ? error.message : String(error));
      process.exit(1);
})
    


export default pool