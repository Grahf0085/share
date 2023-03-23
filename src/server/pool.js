import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const Pool = pg.Pool

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE && { rejectUnauthorized: false },
})

pool.connect().then(() => {
  console.log('Connected to pg database')
})

export default pool
