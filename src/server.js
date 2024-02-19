require("dotenv").config();
const express = require("express");

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
