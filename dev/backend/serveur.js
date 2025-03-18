const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3002;
const KEY_PATH = "keys.json";
const DEP_PATH = "departements.json"
const FILE_PATH_GEOCAPTCHAS = "geocaptchas.json"

app.use(express.json());
app.use(cors());

// Lire les clés existantes
app.get("/keys", (req, res) => {
  fs.readFile(KEY_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lecture fichier" });
    res.json(JSON.parse(data || "[]"));
  });
});

// Ajouter une clé
app.post("/keys", (req, res) => {
  const newKey = { id: Date.now(), ...req.body };

  fs.readFile(KEY_PATH, "utf8", (err, data) => {
    let keys = err ? [] : JSON.parse(data || "[]");
    keys.push(newKey);

    fs.writeFile(KEY_PATH, JSON.stringify(keys, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur écriture fichier" });
      res.json(newKey);
    });
  });
});

// Supprimer une clé
app.delete("/keys/:id", (req, res) => {
  fs.readFile(KEY_PATH, "utf8", (err, data) => {
    let keys = err ? [] : JSON.parse(data || "[]");
    const newKeys = keys.filter((key) => key.id != req.params.id);

    fs.writeFile(KEY_PATH, JSON.stringify(newKeys, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur écriture fichier" });
      res.json({ success: true });
    });
  });
});

app.get("/departements", (req, res) => {
  fs.readFile(DEP_PATH, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Erreur de lecture du fichier" });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Lire les captchas existants
app.get("/geocaptchas", (req, res) => {
  fs.readFile(FILE_PATH_GEOCAPTCHAS, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lecture fichier" });
    res.json(JSON.parse(data || "[]"));
  });
});

// Ajouter un captcha
app.post("/geocaptchas", (req, res) => {
  const newCaptcha = { id: Date.now(), ...req.body };

  fs.readFile(FILE_PATH_GEOCAPTCHAS, "utf8", (err, data) => {
    let captchas = err ? [] : JSON.parse(data || "[]");
    captchas.push(newCaptcha);

    fs.writeFile(FILE_PATH_GEOCAPTCHAS, JSON.stringify(captchas, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur écriture fichier" });
      res.json(newCaptcha);
    });
  });
});

// Supprimer un captcha
app.delete("/geocaptchas/:id", (req, res) => {
  fs.readFile(FILE_PATH_GEOCAPTCHAS, "utf8", (err, data) => {
    let captchas = err ? [] : JSON.parse(data || "[]");
    const newCaptchas = captchas.filter((captcha) => captcha.id != req.params.id);

    fs.writeFile(FILE_PATH_GEOCAPTCHAS, JSON.stringify(newCaptchas, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur écriture fichier" });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));