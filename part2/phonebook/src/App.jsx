import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const Filter = ({ handleChange, text }) => {
  return (
    <>
      {text} <input onChange={handleChange} />
    </>
  );
};

const PersonForm = ({ handleForm, handleName, handleNumber, newNumber, newName }) => {
  return (
  <>
    <form onSubmit={handleForm}>
      <div>
        name: <input value={newName} onChange={handleName}/>
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

const Persons = ({ displayedPersons }) => {
  return displayedPersons.map(person => <li key={person.name}>{person.name} {person.number}</li>);
};

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [displayedPersons, setDisplayedPersons] = useState(persons);

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        setPersons(response.data);
        setDisplayedPersons(response.data);
    })
      .catch(error => console.log(error));
  }, []);

  function contactExists(name) {
    return persons.find(person => person.name.toLowerCase() === name.toLowerCase());
  }

  function handleNameChange(event) {
    setNewName(event.target.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const trimmedNewName = newName.trim();
    if (contactExists(trimmedNewName)) {
      alert(`${trimmedNewName} already exists in the phonebook`);
      return;
    }
    
    const newPersons = [...persons, { name: trimmedNewName, number: newNumber.trim() }];

    setPersons(newPersons);
    setDisplayedPersons(newPersons);
    setNewName('');
    setNewNumber('');
  }

  function handleNumberChange(event) {
    setNewNumber(event.target.value);
  }

  function handleFilterChange(event) {
    const filter = event.target.value;
    const displayedPersons = persons.filter(person => new RegExp(filter, "i").test(person.name));
    setDisplayedPersons(displayedPersons);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleChange={handleFilterChange} text={"filter shown with"}/>
      <h2>Add a new</h2>
      <PersonForm
        handleName={handleNameChange}
        handleNumber={handleNumberChange}
        handleForm={handleFormSubmit}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons displayedPersons={displayedPersons} />
    </div>
  )
}

export default App;