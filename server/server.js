const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes");
const { dbConnection } = require("./lib/dbConnection");


const app = express();
app.use(express.json());
app.use(cookieParser())

const port = process.env.PORT || 5000;

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  dbConnection();
  console.log(`Server is running on port ${port}`);
});
