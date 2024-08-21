const jwt = require("jsonwebtoken");

exports.authUser = async (req, res, next) => {
  try {
    let temp = req.header("Authorization");
    const token = temp ? temp.slice(7, temp.length) : "";
    if (!token) {
      return res.status(400).json({ message: "Invalid authentification" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
      if (err) {
        return res.status(400).json({ message: "Invalid authentification" });
      }
      req.user = data;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
