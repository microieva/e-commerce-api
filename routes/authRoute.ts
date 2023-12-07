import express from "express"
import passport from "passport"

import UsersController from "../controllers/usersController"
import { validateLoginRequest } from "../middlewares/validateLoginRequest"
import { validateNewUserRequest } from "../middlewares/validateNewUserRequest"
import { checkAuth as authenticateLoginRequest } from "../middlewares/checkAuth"

const router = express.Router();

router.post(
    "/signup", 
    validateNewUserRequest, 
    UsersController.createUser
);
router.post(
    "/login", 
    validateLoginRequest, 
    UsersController.login
);

router.post(
    "/login-google",
    passport.authenticate("google-id-token", { session: false }),
    UsersController.googleLogin
);

router.get("/profile", 
    authenticateLoginRequest, 
    UsersController.getUserByToken
);

export default router;