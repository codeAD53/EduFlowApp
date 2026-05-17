import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './index.ts'

const runMigrations = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const migrationsDir = path.join(__dirname, 'migrations')

  // Ensure schema_migrations table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations(
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Get all sql files in order
  const sqlFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()  // ensures 001, 002, 003... order

  console.log(`Running ${sqlFiles.length} migrations...`)

  for (const sqlFile of sqlFiles) {

    //CHECK IF ALREADY APPLIED
    const { rows } = await pool.query(
      `SELECT version FROM schema_migrations WHERE version=$1`,
      [sqlFile]
    );

    if (rows.length > 0) {
      console.log(`⏭️ ${sqlFile} already applied, skipping...`)
      continue;
    }
    const filePath = path.join(migrationsDir, sqlFile)
    const sql = fs.readFileSync(filePath, 'utf-8')

    await pool.query('BEGIN')
    try {
      await pool.query(sql)
      await pool.query(
        'INSERT INTO schema_migrations (version) VALUES ($1)', [sqlFile]
      );
      await pool.query('COMMIT');
      console.log(`✅ ${sqlFile} migrated successfully`)
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error(`❌ ${sqlFile} failed:`, (err as Error).message)
      process.exit(1)
    }
  }

  console.log('All migrations completed!')
  process.exit(0)
}

runMigrations()