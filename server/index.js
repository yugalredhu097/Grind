// imports
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const connectDB = require("./config/db");
const questionRoutes = require("./routes/questions");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/questions", questionRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
