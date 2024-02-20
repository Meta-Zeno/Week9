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
    console.log("plaintextpassword", plaintextpassword);

    const user = await User.findOne({ where: { username: req.body.username } });
    console.log("user", user.dataValues.password);
    const matched = await bcrypt.compare(
      plaintextpassword,
      user.dataValues.password
    );
    console.log("matched", matched);
    if (!matched) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

module.exports = {
  hashPass: hashPass,
  comparePass: comparePass,
};

//compare the password
//plain text password
//plain text password (e.g. mypassword123)
//get the plain text password from the request body
//how do we get the hashed password? find the user
//how do we find the user? by the username -  sent in the request body
//weve found the user - then use bcrypt to compare.
//bcrypt.compare(myplaintextpoassword, hashedpassword)
// we have found the user - then use bcrypt to compare.
// const matched = use bcrypt.compare(plaintext, hashed password)
//if matched false  - responce with code from unauthorsied
