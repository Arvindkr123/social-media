import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getFollowersPostsController,
  getFollowingPostsController,
  likeAndUnlikePostController,
} from "../controllers/post.controllers.js";
import { isAuthenticated } from "./../middlewares/auth.middlewares.js";
const router = Router();

router.route("/upload/post").post(isAuthenticated, createPostController);
router
  .route("/:id")
  .get(isAuthenticated, likeAndUnlikePostController)
  .delete(isAuthenticated, deletePostController);
router
  .route("/")
  .get(isAuthenticated, getFollowingPostsController)
  .get(isAuthenticated, getFollowersPostsController)

export default router;
