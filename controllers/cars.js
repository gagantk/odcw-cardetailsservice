const mongoose = require('mongoose');
const Car = require('../models/car');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const addCar = async (req, res, next) => {
  const { regno, model, address } = req.body;
  const newCar = new Car({
    carModel: model,
    carRegNo: regno,
    carImage: req.file.buffer,
    address: address,
    owner: req.userData.userId,
  });
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Adding car failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newCar.save({ session: sess });
    user.cars.push(newCar);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Adding car failed, please try again.', 500);
    return next(error);
  }
  res.status(201).json({ car: newCar });
};

const getCarsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithCars;
  try {
    userWithCars = await User.findById(userId).populate('cars');
  } catch (err) {
    const error = new HttpError(
      'Fetching cars failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!userWithCars || userWithCars.cars.length === 0) {
    return next(new HttpError('No car details available for this user.', 404));
  }

  res.json({
    cars: userWithCars.cars.map((car) => car.toObject({ getters: true })),
  });
};

exports.addCar = addCar;
exports.getCarsByUserId = getCarsByUserId;
