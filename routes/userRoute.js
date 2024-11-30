
const express = require("express");
const userController = require("../controllers/userController");
const userRoute = express.Router();

userRoute.get('/register', userController.loadRegister);
userRoute.post('/register', userController.insertUser);


userRoute.get('/login', userController.loadLogin);
userRoute.post('/login', userController.authenticateUser);

userRoute.get('/dashboard', userController.loadDashboard);

userRoute.get('/logout', userController.logoutUser);

module.exports = userRoute;
