import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

function createPerson(newPerson) {
  return axios
    .post(baseUrl, newPerson)
    .then(response => response.data);
}

function getAllPersons() {
  return axios
    .get(baseUrl)
    .then(response => response.data);
}

function deletePerson(id) {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then(response => response.data);
}

function updatePerson(updatedPerson) {
  return axios
    .put(`${baseUrl}/${updatedPerson.id}`, updatedPerson)
    .then(response => response.data);
}

export const personService = { createPerson, getAllPersons, deletePerson, updatePerson };