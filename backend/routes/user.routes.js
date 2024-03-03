import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import {
  registerController,
  userLoginController,
  userFollowsController,
  userLogoutController,
  userUpdatePasswordController,
  userUpdateProfileController,
  deleteMyProfileController
} from "../controllers/user.controllers.js";
const router = Router();

router.route("/register").post(registerController);
router.route("/login").post(userLoginController);
router.route("/follow/:id").get(isAuthenticated, userFollowsController);
router.route("/logout").get(userLogoutController);
router
  .route("/updatePassword")
  .post(isAuthenticated, userUpdatePasswordController);
router
  .route("/updateProfile")
  .post(isAuthenticated, userUpdateProfileController);

router.route("/delete/me").delete(isAuthenticated, deleteMyProfileController)

export default router;
