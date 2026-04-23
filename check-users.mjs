import { Pool } from 'pg';
import { config } from 'dotenv';
config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkUsers() {
  try {
    const res = await pool.query('SELECT id, name, email, role FROM "user"');
    console.log(`Found ${res.rowCount} users:`);
    console.table(res.rows);
  } catch (err) {
    console.error('Error querying users:', err.message);
  } finally {
    pool.end();
  }
}

checkUsers();
