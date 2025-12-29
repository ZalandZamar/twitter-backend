const register = (req, res) => {
  res.send("sign in");
};

const logIn = (req, res) => {
  res.send("logged in");
};

module.exports = {
  register,
  logIn,
};
