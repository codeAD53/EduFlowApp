import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './index.ts'

const runMigrations = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const migrationsDir = path.join(__dirname, 'migrations')

  // Get all sql files in order
  const sqlFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()  // ensures 001, 002, 003... order

  console.log(`Running ${sqlFiles.length} migrations...`)

  for (const sqlFile of sqlFiles) {
    const filePath = path.join(migrationsDir, sqlFile)
    const sql = fs.readFileSync(filePath, 'utf-8')

    try {
      await pool.query(sql)
      console.log(`✅ ${sqlFile} migrated successfully`)
    } catch (err: any) {
      console.error(`❌ ${sqlFile} failed:`, err.message)
      process.exit(1)
    }
  }

  console.log('All migrations completed!')
  process.exit(0)
}

runMigrations()