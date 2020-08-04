const mongoose = require('mongoose');
const HttpError = require('./http-error');

const carSchema = new mongoose.Schema({
  carRegNo: {
    type: String,
    required: true,
  },
  carModel: {
    type: String,
    required: true,
  },
  carImage: {
    type: Buffer,
  },
  address: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
