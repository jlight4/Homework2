const Mongoose = require('mongoose');

module.exports = Mongoose.model('User', new Mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  ssn: {
    type: String, required: true, min: 11, max: 11,
  },
  address: { type: String, required: false },
  phone: { type: String, required: false },
}, {
  toJSON: {
    getters: true,
    virtuals: false,
  },
}));
