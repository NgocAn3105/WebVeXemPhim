const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const port = 5000;
const app = express();
const route = require("./routes");

app.use(morgan("combined"));
app.use(express.json());
app.use(cors());


// Routes
route(app);


// Chạy server
app.listen(port, () => console.log(`http://localhost:${port}`));
