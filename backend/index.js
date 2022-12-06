const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = 3001;
const { encrypt, decrypt } = require("./EncryptionHandler");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: process.env.DB_PASSWORD,
  database: "PasswordManager",
});
db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("Database connected !");
});

// app.get("/", (req,res,next) => {
//   res.json({
//     msg: "Cors enabled !",
//   });
// });

//Below here lies functions to add password to database.
app.post("/addpassword", (req, res) => {
  const { password, website_name } = req.body;

  const encryptedPassword = encrypt(password);

  db.query(
    "INSERT INTO password (password, website_name, iv) VALUES (?,?,?)",
    [encryptedPassword.password, website_name, encryptedPassword.iv],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Password added !");
        res.send("Success");
      }
    }
  );
});

//Below here lies functions to retrieve passwords
app.get("/getpasswords", (req, res) => {
  db.query("SELECT * FROM password", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/decryptPassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.listen(PORT, () => {
  console.log("Backend is running !");
});
