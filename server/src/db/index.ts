import { Pool } from 'pg'
import { env } from '../config/env.ts';
import { logger } from '../utils/logger.ts';

if (isNaN(env.DB_PORT)) {
    throw new Error("DB_PORT must be valid number");
}

const pool = new Pool({
  host:     env.DB_HOST,
  port:     env.DB_PORT,
  database: env.DB_NAME,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000 //Prevent hanging and better scalability
})

// Test connection
export const testConnection = async () => {
      try {
          const client = await pool.connect();
          logger.info("Database Connected Successfully");
          client.release();
      } catch (error:unknown) {
                    logger.error(
                        `Database Connection Failed: ${
                            error instanceof Error ? error.message : String(error)
                        }`
                    );

          throw error;
      };
      
};
export default pool