import { postModel } from "../models/post.models.js";
import { userModel } from "./../models/user.models.js";

export const createPostController = async (req, res, next) => {
  try {
    let newPostData = {
      caption: req.body.caption,
      image: {
        public_id: req.body.public_id,
        url: req.body.url,
      },
      owner: req.user._id,
    };
    const newPost = await postModel.create(newPostData);
    const user = await userModel.findById(req.user._id);
    user.posts.push(newPost._id);
    await user.save();
    res.status(200).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likeAndUnlikePostController = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    console.log(req.user._id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found." });
    }
    console.log(post.likes[req.user._id.toString()]);

    if (post.likes.includes(req.user._id)) {
      console.log("unlike post");
      let index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();
      return res
        .status(200)
        .json({ success: true, message: "Post unliked successfully" });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      return res
        .status(200)
        .json({ success: true, message: "Post liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePostController = async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: "Unauthorized" });
    }
    const user = await userModel.findById(req.user._id);
    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);
    //console.log(post);
    await user.save();
    await post.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFollowersPostsController = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFollowingPostsController = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    const posts = await postModel.find({ owner: { $in: user.follwing } });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
