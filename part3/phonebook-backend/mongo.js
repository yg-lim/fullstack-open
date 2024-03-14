const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("password is required");
  process.exit(1);
}

if (process.argv.length !== 5 && process.argv.length !== 3) {
  console.log(process.argv);
  console.log("invalid number of arguments");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://yglim:${password}@fullstack-open.zvpmexg.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstack-open`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  newPerson.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
