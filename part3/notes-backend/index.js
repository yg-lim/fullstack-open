require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { Note } = require("./models/Note");

app.use(cors());
app.use(express.static(__dirname + "/dist"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  Note.findById(id)
    .then((foundNote) => res.json(foundNote))
    .catch((error) => res.status(404).json({ error: "Note not found." }));
});

app.put("/api/notes/:id", (req, res) => {
  const id = +req.params.id;
  const note = notes.find((note) => note.id === id);
  if (!note) res.status(404).end();
  else {
    note.important = !note.important;
    res.json(note);
  }
});

app.post("/api/notes/", (req, res) => {
  const body = req.body;

  if (!body.content) {
    res.status(400).json({ error: "Content missing" });
    return;
  }

  const note = new Note({
    content: body.content,
    important: !!body.important,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = +req.params.id;

  if (id) {
    notes = notes.filter((note) => note.id === id);
    res.status(204).end();
  } else res.status(404).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
