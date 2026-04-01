const express = require('express');
const cors = require('cors');
const studentRoutes = require('./src/routes/studentRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
  res.send('API Running...');
});

module.exports = app;