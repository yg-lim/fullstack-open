const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  }],
});

userSchema.set("toJSON", {
  transform: function (_doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
})

const User = mongoose.model("User", userSchema);

module.exports = User;
