const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // För att servera HTML-filer från mappen "public"

// MySQL-anslutning
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // om du inte har något lösenord
  database: "chatbotdb",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Kunde inte ansluta till databasen:", err);
    return;
  }
  console.log("Ansluten till MySQL-databasen!");
});

// Ta emot formulärdata
app.post("/chat", (req, res) => {
  const userInput = req.body.userInput;

  // Hämta svaret från databasen
  db.query(
    "SELECT output FROM chatbot WHERE input = ?",
    [userInput],
    (err, results) => {
      if (err) {
        console.error(err);
        res.send("Något gick fel.");
        return;
      }

      if (results.length > 0) {
        res.send(results[0].output);
      } else {
        res.send("Jag förstår tyvärr inte. Försök fråga något annat.");
      }
    }
  );
});

// Starta servern
app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
