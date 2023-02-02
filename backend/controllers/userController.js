const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validations
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please, fill in all required fields!");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters!");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("This Email has already been registered!");
  }

  // Create new User
  const user = await User.create({ name, email, password });

  // GENERATE TOKEN
  const token = generateToken(user._id);

  // SEND HTTP-ONLY COOKIE
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({ _id, name, email, photo, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("Invalid User Data!");
  }
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  // res.send("Login User!");
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please, write your email and password!");
  }
  // Check if User exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not Found. Please, sign up!");
  }

  // Check if Password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // GENERATE TOKEN
  const token = generateToken(user._id);

  // SEND HTTP-ONLY COOKIE
  if (passwordIsCorrect) {
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: false,
    });
  }

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({ _id, name, email, photo, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password!");
  }
});

// LOGOUT USER
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({ message: "Successfuly Log Out!" });
});

// GET USER
const getUser = asyncHandler(async (req, res) => {
  // res.send("Get User!");
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({ _id, name, email, photo, phone, bio });
  } else {
    res.status(400);
    throw new Error("User not Found!");
  }
});

// GET LOGIN STATUS
const loginStatus = asyncHandler(async (req, res) => {
  // res.send("Login Status!");

  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verify Token
  const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);

  if (tokenVerified) {
    return res.json(true);
  }

  return res.json(false);
});

// UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
  // res.send("Update User!");
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;

    const updateUser = await user.save();
    res.status(200).json({
      name: updateUser.name,
      email: updateUser.email,
      photo: updateUser.photo,
      phone: updateUser.phone,
      bio: updateUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not Found!");
  }
});

// CHANGE PASSWORD
const changePassword = asyncHandler(async (req, res) => {
  // res.send("Change Password!");
  const user = await User.findById(req.user._id);
  const { oldpassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not Found! Please, Sign Up!");
  }
  if (!oldpassword || !password) {
    res.status(400);
    throw new Error("Please, add Old and New Password!");
  }

  // Check if Old Password matches Password in DB
  const passwordIsCorrect = await bcrypt.compare(oldpassword, user.password);

  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password Updated Successfully!");
  } else {
    res.status(404);
    throw new Error("Old Password is not Correct!");
  }
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
};
