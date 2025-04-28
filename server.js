const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();
const port = 3000;

// Middleware för att läsa formulärdata
app.use(express.urlencoded({ extended: true }));

// Koppling till databasen
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatbotdb",
});

// Start
db.connect((err) => {
  if (err) {
    console.error("Databasanslutning misslyckades:", err);
    return;
  }
  console.log("Ansluten till databasen.");
});

// Visa HTML-sidan
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Hantera formulär
app.post("/chat", (req, res) => {
  const userInput = req.body.message;

  db.query(
    "SELECT output FROM chatbot WHERE input = ?",
    [userInput],
    (err, results) => {
      if (err) {
        return res.send("Databasfel.");
      }

      if (results.length > 0) {
        res.send(`<p>${results[0].output}</p><a href="/">Tillbaka</a>`);
      } else {
        res.send(`<p>Jag förstår inte.</p><a href="/">Försök igen</a>`);
      }
    }
  );
});

// Starta servern
app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
