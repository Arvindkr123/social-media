import { userModel } from "./../models/user.models.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    user = await userModel.create({
      name,
      email,
      password,
      avtar: { public_id: "sample_id", url: "www.google.com" },
    });
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(201)
      .cookie("token", token, options)
      .json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const userLoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Corrected: Add await here to ensure that the promise is resolved
    let isMatchPassword = await user.matchPassword(password);
    // console.log(isMatchPassword);
    if (!isMatchPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res
      .status(200)
      .cookie("token", token, options)
      .json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userFollowsController = async (req, res, next) => {
  try {
    const userToFollow = await userModel.findById(req.params.id);
    const loggedInUser = await userModel.findById(req.user._id);
    if (!userToFollow) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    if (loggedInUser.follwing.includes(userToFollow._id)) {
      let indexFollowing = loggedInUser.follwing.indexOf(userToFollow._id);
      loggedInUser.follwing.splice(indexFollowing, 1);

      let indexFollowers = userToFollow.follwers.indexOf(loggedInUser._id);
      userToFollow.follwers.splice(indexFollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();
      res
        .status(200)
        .send({ success: true, message: "unfollowed successfully" });
    } else {
      loggedInUser.follwing.push(userToFollow._id);
      userToFollow.follwers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();
      res.status(200).send({ success: true, message: "followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userLogoutController = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", null)
      .json({ success: true, message: "user logout successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};