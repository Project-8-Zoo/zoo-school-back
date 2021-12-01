const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    // required: "First Name is Required"
  },

  lastName: {
    type: String,
    trim: true,
    // required: "Last Name is Required"
  },

  username: {
    type: String,
    trim: true,
    required: "Username is Required"
  },

  password: {
    type: String,
    trim: true,
    required: "Password is Required",
    validate: [({ length }) => length >= 6, "Password should be longer."]
  },

  // email: {
  //   type: String,
  //   unique: true,
  //   match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  // },

  userCreated: {
    type: Date,
    default: Date.now
  },

  highscore: {
    type: Number,
    default: 0
  },

  lastUpdated: Date

});

UserSchema.methods.setFullName = function() {
  this.fullName = `${this.firstName} ${this.lastName}`;

  return this.fullName;
};

UserSchema.methods.lastUpdatedDate = function() {
  this.lastUpdated = Date.now();

  return this.lastUpdated;
};

UserSchema.pre("save", function(next) {
  if(!this.isModified("password")) {
      return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function(plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
