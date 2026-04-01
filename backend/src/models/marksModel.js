const { getPool } = require('../config/db');

const addMark = (studentId, subject, marks) => {
  const pool = getPool();
  return pool.query(
    'INSERT INTO marks(student_id, subject, marks) VALUES($1,$2,$3) RETURNING *',
    [studentId, subject, marks]
  );
};

const getMarksByStudentId = (studentId) => {
  const pool = getPool();
  return pool.query(
    'SELECT subject, marks FROM marks WHERE student_id=$1',
    [studentId]
  );
};

const updateMark = (id, subject, marks) => {
  const pool = getPool();

  return pool.query(
    'UPDATE marks SET subject=$1, marks=$2 WHERE id=$3 RETURNING *',
    [subject, marks, id]
  );
};

module.exports = {
  addMark,
  getMarksByStudentId,
  updateMark
};