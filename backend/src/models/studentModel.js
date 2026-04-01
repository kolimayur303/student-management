const { getPool } = require('../config/db');

const createStudent = (name, email, age) => {
  const pool = getPool();
  return pool.query(
    'INSERT INTO students(name,email,age) VALUES($1,$2,$3) RETURNING *',
    [name, email, age]
  );
};

const getStudents = (limit, offset) => {
  const pool = getPool();
  return pool.query(
    'SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2',
    [limit, offset]
  );
};

const getStudentsWithMarks = (limit, offset) => {
  const pool = getPool();

  return pool.query(`
    SELECT 
      s.id,
      s.name,
      s.email,
      s.age,
      s.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', m.id,
            'subject', m.subject,
            'marks', m.marks
          )
        ) FILTER (WHERE m.id IS NOT NULL),
        '[]'
      ) AS marks
    FROM students s
    LEFT JOIN marks m ON s.id = m.student_id
    GROUP BY s.id
    ORDER BY s.id DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset]);
};

const getTotalStudents = () => {
  const pool = getPool();
  return pool.query('SELECT COUNT(*) FROM students');
};

const getStudentById = (id) => {
  const pool = getPool();
  return pool.query('SELECT * FROM students WHERE id=$1', [id]);
};

const updateStudent = (id, name, email, age) => {
  const pool = getPool();
  return pool.query(
    'UPDATE students SET name=$1,email=$2,age=$3 WHERE id=$4 RETURNING *',
    [name, email, age, id]
  );
};

const deleteStudent = (id) => {
  const pool = getPool();
  return pool.query('DELETE FROM students WHERE id=$1', [id]);
};

module.exports = {
  createStudent,
  getStudents,
  getTotalStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsWithMarks
};