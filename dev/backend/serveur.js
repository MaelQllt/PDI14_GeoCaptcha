const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const FILE_PATH = "keys.json";

app.use(express.json());
app.use(cors());

// Lire les clés existantes
app.get("/keys", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lecture fichier" });
    res.json(JSON.parse(data || "[]"));
  });
});

// Ajouter une clé
app.post("/keys", (req, res) => {
  const newKey = { id: Date.now(), ...req.body };

  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    let keys = err ? [] : JSON.parse(data || "[]");
    keys.push(newKey);

    fs.writeFile(FILE_PATH, JSON.stringify(keys, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur écriture fichier" });
      res.json(newKey);
    });
  });
});

// Supprimer une clé
app.delete("/keys/:id", (req, res) => {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    let keys = err ? [] : JSON.parse(data || "[]");
    const newKeys = keys.filter((key) => key.id != req.params.id);

    fs.writeFile(FILE_PATH, JSON.stringify(newKeys, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur écriture fichier" });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));