const { Users } = require("../db/usersModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const signup = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const costFactor = 6;
    const hashPassword = await bcryptjs.hash(password, costFactor);
    const data = await Users.findOne({ email: email });
    const avatarURL = gravatar.url(email);
    if (data)
      return res.json({
        status: "conflict",
        code: 409,
        message: "Email in use",
      });
    const newUser = new Users({
      password: hashPassword,
      email,
      subscription: "starter",
      token: null,
      avatarURL,
    });
    await newUser.save();

    res.json({
      status: "Created",
      code: 201,
      user: { email, subscription: newUser.subscription },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const data = await Users.findOne({ email: email });
    const hashPassword = data.password;
    let isCorrectPassword;
    if (data) {
      isCorrectPassword = await bcryptjs.compare(password, hashPassword);
    }
    if (!data || !isCorrectPassword)
      return res.json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrong",
      });
    if (isCorrectPassword) {
      const payload = { payload: "payload" };
      const secret = "secret words";
      const token = jwt.sign(payload, secret, { expiresIn: "1d" });
      await Users.findOneAndUpdate({ email: email }, { token: token });
      res.json({
        status: "OK",
        code: 200,
        ResponseBody: {
          token,
          user: {
            email,
            subscription: data.subscription,
          },
        },
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.token;
    const decode = jwt.decode(token);
    const userById = Users.findOne({ _id: decode.id });
    if (!userById) {
      return res.json({
        status: "Unauthorized",
        code: 401,
        message: "Not authorized",
      });
    }
    await Users.findByIdAndUpdate({ _id: decode.id }, { token: null });
    res.json({ status: "No Content", code: 204 });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const token = req.token;
    const decode = jwt.decode(token);
    const user = Users.findOne({ _id: decode.id });
    res.json({
      status: "OK",
      code: 200,
      ResponseBody: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  const newDataUser = await Users.findByIdAndUpdate(
    { _id: req.user._id },
    { avatarURL: req.file.path },
    { new: true }
  );

  if (!newDataUser) {
    res.status(401).json({
      message: "Not authorized",
    });
  }
  res.status(200).json({ avatarURL: newDataUser.avatarURL });
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
};
