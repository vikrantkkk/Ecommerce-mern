const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const { dbConnection } = require("./lib/dbConnection");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

const port = process.env.PORT || 5000;

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  dbConnection();
  console.log(`Server is running on port ${port}`);
});
