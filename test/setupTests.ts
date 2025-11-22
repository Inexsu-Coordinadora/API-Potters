// setupTests.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDBNAME,
});


// beforeAll(async () => {
//   await pool.connect();  
// });

// beforeEach(async () => {
//   await pool.query("BEGIN");  
// });

// afterEach(async () => {
//   await pool.query("ROLLBACK");  
// });

// afterAll(async () => {
//   await pool.end();  
// });


