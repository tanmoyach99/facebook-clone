const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// let allowed = ["http://localhost:3000"];

// function options(req, res) {
//   let temp;

//   let origin = res.header("origin");
//   if (allowed.indexOf(origin) > -1) {
//     temp = { origin: true, optionSuccessStatus: 200 };
//   } else {
//     temp = { origin: "none" };
//   }
//   res(null, temp);
// }
// app.use(cors(options));

app.use(cors());
const { readdirSync } = require("fs");

//all routes map
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

const URI = process.env.DATABASE_URL;
mongoose.set("strictQuery", false);
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("connected to mongodb");
  }
);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("server is running,.......", port);
});
