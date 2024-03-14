import { useState } from "react";
import { useEffect } from "react";
import { personService } from "./services/persons";

const Filter = ({ handleChange, text }) => {
  return (
    <>
      {text} <input onChange={handleChange} />
    </>
  );
};

const PersonForm = ({
  handleForm,
  handleName,
  handleNumber,
  newNumber,
  newName,
}) => {
  return (
    <>
      <form onSubmit={handleForm}>
        <div>
          name: <input value={newName} onChange={handleName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const Persons = ({ displayedPersons, handleDelete }) => {
  return displayedPersons.map((person) => {
    return (
      <li key={person.id}>
        {person.name} {person.number}
        <button data-id={person.id} onClick={handleDelete}>
          delete
        </button>
      </li>
    );
  });
};

const Notification = ({ message }) => {
  if (message && message.text) {
    return <div className={message.type}>{message.text}</div>;
  }
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [displayedPersons, setDisplayedPersons] = useState(persons);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService
      .getAllPersons()
      .then((response) => {
        setPersons(response);
        setDisplayedPersons(response);
      })
      .catch(() => {
        createNotification({
          type: "error",
          text: "Error, could not retrieve persons.",
        });
        setPersons([]);
        setDisplayedPersons([]);
      });
  }, []);

  function createNotification(message) {
    setMessage(message);
    setTimeout(() => setMessage({}), 5000);
  }

  function contactExists(name) {
    return persons.find(
      (person) => person.name.toLowerCase() === name.toLowerCase(),
    );
  }

  function handleNameChange(event) {
    setNewName(event.target.value);
  }

  function addNewPerson(newName, newNumber) {
    const newPerson = { name: newName, number: newNumber };

    personService
      .createPerson(newPerson)
      .then((response) => {
        const newPersons = [...persons, response];
        setPersons(newPersons);
        setDisplayedPersons(newPersons);
        setNewName("");
        setNewNumber("");
        createNotification({
          type: "success",
          text: `${newPerson.name} has been added.`,
        });
      })
      .catch(() => {
        createNotification({
          type: "error",
          text: `${newPerson.name} could not be added.`,
        });
      });
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const trimmedNewName = newName.trim();
    const trimmedNewNumber = newNumber.trim();
    const matchingContact = contactExists(trimmedNewName);

    if (matchingContact) {
      const warning =
        `${matchingContact.name} already exists in the phonebook.` +
        "Replace the old number with a new one?";
      if (!window.confirm(warning)) {
        alert("Duplicate contacts not allowed. Contact not added.");
        return;
      }

      personService
        .updatePerson({ ...matchingContact, number: trimmedNewNumber })
        .then((response) => {
          const newPersons = persons.map((person) =>
            person.id === response.id ? response : person,
          );
          setPersons(newPersons);
          setDisplayedPersons(newPersons);
        })
        .catch(() => {
          createNotification({
            type: "error",
            text: `${matchingContact.name} could no longer be found or has been deleted.`,
          });
        });

      return;
    }

    addNewPerson(trimmedNewName, trimmedNewNumber);
  }

  function handleNumberChange(event) {
    setNewNumber(event.target.value);
  }

  function handleFilterChange(event) {
    const filter = event.target.value;
    const displayedPersons = persons.filter((person) =>
      new RegExp(filter, "i").test(person.name),
    );
    setDisplayedPersons(displayedPersons);
  }

  function handleDeletePerson(event) {
    event.preventDefault();

    const id = +event.target.dataset.id;
    const personToDelete = persons.find((person) => person.id === id);
    const warning = `Delete ${personToDelete.name}?`;

    if (window.confirm(warning)) {
      personService
        .deletePerson(id)
        .then(() => {
          const newPersons = persons.filter((person) => person.id !== id);
          setPersons(newPersons);
          setDisplayedPersons(newPersons);
        })
        .catch(() => {
          createNotification({
            type: "error",
            text: `${personToDelete.name} could not be found or has already been deleted.`,
          });
        });
    }
  }

  return (
    <div>
      <Notification message={message} />
      <h2>Phonebook</h2>
      <Filter handleChange={handleFilterChange} text={"filter shown with"} />
      <h2>Add a new</h2>
      <PersonForm
        handleName={handleNameChange}
        handleNumber={handleNumberChange}
        handleForm={handleFormSubmit}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons
        displayedPersons={displayedPersons}
        handleDelete={handleDeletePerson}
      />
    </div>
  );
};

export default App;
