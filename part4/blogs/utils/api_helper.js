const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const user = {
  username: "admin",
  password: "dev",
  name: "Adam Min",
};

const login = {
  username: "admin",
  password: "dev",
}

async function createUserAndLogin() {
  await api
  .post('/api/users')
  .send(user)
  .expect(201);
  
  const response = await api
  .post('/api/login')
  .send(login)
  .expect(201);
  
  return response.get("Authorization");
}

module.exports = { createUserAndLogin };