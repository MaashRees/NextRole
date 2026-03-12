const express = require("express");
const router = express.Router();

const usersController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { validateWithJoi } = require("../middlewares/validate.middleware");

const { loginSchema, registerSchema, updateProfileSchema, updatePasswordSchema } = require("../dtos/user.dto");

router.post('/register', validateWithJoi(registerSchema), usersController.Register);
router.post('/login', validateWithJoi(loginSchema), usersController.Login);

router.use(authenticate);

router.get('/profile', usersController.getProfile);
router.put('/me', validateWithJoi(updateProfileSchema), usersController.updateProfile);
router.delete('/me', usersController.deleteMe);
router.post('/new-password', validateWithJoi(updatePasswordSchema), usersController.updatePassword);

module.exports = router;