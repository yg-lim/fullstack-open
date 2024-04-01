import axios from 'axios'
const baseUrl = '/api/notes'

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data;
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  };

  const request = await axios.post(baseUrl, newObject, config);
  return request.data;
}

const update = async (id, newObject) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObject)
  return request.data;
}

export default { 
  getAll, create, update, setToken,
}