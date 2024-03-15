require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");
const { Person } = require("./models/Person");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/dist"));
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body"),
);

app.get("/api/persons/", (req, res) => {
  Person.find({}).then((returnedPersons) => {
    res.json(returnedPersons);
  });
});

app.get("/info", (req, res) => {
  const info = `<p>Phonebook has info for ${persons.length} people.`;
  const date = new Date().toUTCString();
  res.send(info + `<p>${date}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const person = persons.find((person) => person.id === id);

  if (!person) res.status(404).end();
  else res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const idxOfPerson = persons.findIndex((person) => person.id === id);
  if (idxOfPerson !== -1) persons.splice(idxOfPerson, 1);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!person.name || !person.number) {
    res.status(400).json({
      error: "person must have name and number",
    });
    return;
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });

  newPerson
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
