const studentModel = require('../models/studentModel');
const marksModel = require('../models/marksModel');

exports.createStudent = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const result = await studentModel.createStudent(name, email, age);

    res.status(201).json(result.rows[0]);

  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    res.status(500).json({ error: err.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const students = await studentModel.getStudentsWithMarks(limit, offset);
    const total = await studentModel.getTotalStudents();

    res.json({
      data: students.rows,
      total: parseInt(total.rows[0].count),
      page,
      limit
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await studentModel.getStudentById(id);
    const marks = await marksModel.getMarksByStudentId(id);

    res.json({
      ...student.rows[0],
      marks: marks.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({
        error: "Name, email and age are required"
      });
    }

    const result = await studentModel.updateStudent(id, name, email, age);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.json({
      message: "Student updated successfully",
      data: result.rows[0]
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await studentModel.deleteStudent(id);

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMark = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, marks } = req.body;

    if (!subject || !marks) {
      return res.status(400).json({
        error: "Subject and marks are required"
      });
    }

    const result = await marksModel.addMark(id, subject, marks);
    
    res.status(201).json(result.rows[0]);

  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        error: "Subject already exists for this student"
      });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.updateMark = async (req, res) => {
  try {
    const { markId } = req.params;
    const { subject, marks } = req.body;

    if (!subject || !marks) {
      return res.status(400).json({
        error: "Subject and marks are required"
      });
    }

    const result = await marksModel.updateMark(markId, subject, marks);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Mark not found"
      });
    }

    res.json({
      message: "Mark updated successfully",
      data: result.rows[0]
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        error: "Subject already exists for this student"
      });
    }

    res.status(500).json({ error: err.message });
  }
};