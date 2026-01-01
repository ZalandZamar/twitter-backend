const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const headers = req.headers.authorization; // read from headers

  if (!headers || !headers.startsWith("Bearer "))
    return res.status(401).json({ message: "unathorized" });

  const accessToken = headers.split(" ")[1];

  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    req.user = { userId: payload.userId, name: payload.name };

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token invalid or expired" });
  }
};

module.exports = authMiddleware;
