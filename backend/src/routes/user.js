const express = require('express');
const router = express.Router();

const UsersControllers = require('../app/Controllers/UsersControllers');

router.post("/sigin", UsersControllers.Signin);
router.post("/login", UsersControllers.Login);
router.post("/update/pasword", UsersControllers.Update_password_user);
router.post("/update/user/:email", UsersControllers.Update_user);
router.post("/info-user", UsersControllers.Info_user);
module.exports = router;