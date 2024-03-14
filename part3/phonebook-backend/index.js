const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

function generateId() {
  return Math.floor(Math.random() * 99999);
}

function nameExists(personName) {
  return persons.find(
    (person) =>
      person.name.trim().toLowerCase() === personName.trim().toLowerCase(),
  );
}

app.use(cors());
app.use(express.json());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body"),
);

app.get("/api/persons/", (req, res) => {
  res.json(persons);
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
  } else if (nameExists(person.name)) {
    res.status(400).json({
      error: "name must be unique",
    });
  } else {
    person.id = generateId();
    persons.push(person);
    res.send(person);
  }
});

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
