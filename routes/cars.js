const express = require('express');
const router = express.Router();

const carsController = require('../controllers/cars');
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

router.use(checkAuth);

router.post('/new', fileUpload.single('image'), carsController.addCar);

router.get('/user/:uid', carsController.getCarsByUserId);

module.exports = router;
