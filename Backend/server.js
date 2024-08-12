const express = require("express");
const cors = require("cors");
const app = express();
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

app.use(cors());
app.use(express.json());
// routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));
// database
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is listining on port ${PORT}`);
});
