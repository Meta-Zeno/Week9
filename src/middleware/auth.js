const bcrypt = require("bcrypt");

const User = require("../users/model");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const hashPass = async (req, res, next) => {
  try {
    console.log("req.body.password", req.body.password);

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    req.body.password = hashedPassword;
    console.log("req.body.password after hash:", req.body.password);
    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const comparePass = async (req, res, next) => {
  try {
    const plaintextpassword = req.body.password;

    const user = await User.findOne({ where: { username: req.body.username } });

    const matched = await bcrypt.compare(
      plaintextpassword,
      user.dataValues.password
    );

    if (!matched) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

module.exports = {
  hashPass: hashPass,
  comparePass: comparePass,
};
