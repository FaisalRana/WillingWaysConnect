const User = require("../models/User");
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail } = require("../helpers/mailling");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      password,
      email,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    // Validate the email
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          "This email address already exists,try with a different email address",
      });
    }

    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "first name must be between 3 and 30 characters.",
      });
    }
    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: "last name must be between 3 and 30 characters.",
      });
    }
    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "password must be atleast 6 characters.",
      });
    }

    const cryptedPassword = (await bcrypt.hash(password, 12)).toString();

    let tempUserName = first_name + last_name;
    let newUserName = await validateUsername(tempUserName);

    const user = await new User({
      first_name,
      last_name,
      email,
      password: cryptedPassword,
      username: newUserName,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();
    const emailVerificationToken = generateToken(
      { id: user.id.toString() },
      "1hr"
    );
    const url = `process.env.BASE_URL/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user.id,
      username: user.username,
      pictire: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: "Register success ! Please activate your e-mail to start.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

exports.activateAccount = async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, process.env.TOKEN_SECRET);
  const check = await User.findById(user.id);
  if (check.verified === true) {
    return res
      .status(400)
      .json({ message: "This account has already been activated" });
  } else await User.findByIdAndUpdate(user.id, { verified: true });
  return res
    .status(200)
    .json({ message: "Account hase been activated successfuly" });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "This email address is not connected to an account" });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({ message: "Invalid login credentials" });
    }
    const loginToken = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user.id,
      username: user.username,
      pictire: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: loginToken,
      verified: user.verified,
      message: "Register success ! Please activate your e-mail to start.",
    });
  } catch (error) {
    res.send(error);
  }
};
// Status's

// 200 ok
// 204 no content ok
//400 error
// 404 not found
// 403 forbidden
