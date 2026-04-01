const { Pool } = require('pg');

const DB_NAME = 'students_db';

let pool;

//Create DB if not exists
const createDatabase = async () => {
  const defaultPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432,
  });

  try {
    await defaultPool.query(`CREATE DATABASE ${DB_NAME}`);
    console.log(`Database '${DB_NAME}' created`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log("Database already exists");
    } else {
      throw err;
    }
  } finally {
    await defaultPool.end();
  }
};

// Connect DB and Create Tables
const connectDB = async () => {
  try {
    await createDatabase();

    pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: DB_NAME,
      password: '1234',
      port: 5432,
    });

    await pool.query('SELECT NOW()');
    console.log("Connected to students_db");

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id SERIAL PRIMARY KEY,
        student_id INT NOT NULL,
        subject VARCHAR(100) NOT NULL,
        marks INT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      );
    `);

    console.log("Tables ready");

  } catch (err) {
    console.error("DB Setup Error:", err.message);
    process.exit(1); // stop app if DB fails
  }
};

// Safe getter
const getPool = () => {
  if (!pool) {
    throw new Error("DB not initialized. Call connectDB first.");
  }
  return pool;
};

module.exports = {
  connectDB,
  getPool
};