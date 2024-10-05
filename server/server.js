const express = require("express");
const dotenv = require("dotenv");
const { dbConnection } = require("./config/dbConnection");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 5000;

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  dbConnection();
  console.log(`Server is running on port ${port}`);
});
