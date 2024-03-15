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

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((allPersons) => {
      const info = `<p>Phonebook has info for ${allPersons.length} people.`;
      const date = new Date().toUTCString();
      res.send(info + `<p>${date}</p>`);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((foundPerson) => {
      if (!foundPerson) {
        response.status(404).end();
        return;
      }

      res.json(foundPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const newPerson = {
    name: body.content,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, newPerson, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
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
    .catch((error) => next(error));
});

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, _req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
