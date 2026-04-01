const app = require('./app');
const PORT = process.env.PORT || 5000;
const { connectDB } = require('./src/config/db');

const startServer = async () => {
  try {
    //Create DB if not exists
    await connectDB();

    //Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Server start error:", err.message);
  }
};

startServer();