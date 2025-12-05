import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

export async function getConnection() {
  return pool.getConnection();
}

export async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("SELECT 1");
    console.log("✅ DB connection OK");
  } catch (err) {
    console.error("❌ DB connection ERROR:", err);
  } finally {
    if (conn) conn.release();
  }
}
