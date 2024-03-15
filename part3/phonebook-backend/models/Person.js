const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("connecting to mongoDB...");

mongoose
  .connect(url)
  .then((_result) => {
    console.log("successfully connected to mongoDB!");
  })
  .catch((error) => {
    console.log("could not connect to mongoDB ", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Error, name must be of minimum length of 3."],
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator(value) {
        return /^\d{2}\d?-\d+$/.test(value);
      },
    },
  },
});

personSchema.set("toJSON", {
  transform: function (_doc, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = { Person };
