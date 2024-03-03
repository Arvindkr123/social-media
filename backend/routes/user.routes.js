import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
  registerController,
  userLoginController,
  userFollowsController,
  userLogoutController
} from "../controllers/user.controllers.js";
const router = Router();

router.route("/register").post(registerController);
router.route("/login").post(userLoginController);
router.route("/follow/:id").get(isAuthenticated, userFollowsController);
router.route("/logout").get(userLogoutController);

export default router;
