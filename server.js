const express = require("express");
const app = express();
const connectdb = require("./db/connectdb");
require("dotenv").config();
const authRouter = require("./routes/authRoute");
const postRouter = require("./routes/postRoute");
const notFound = require("./middleware/not-found");
const authMiddleware = require("./middleware/authMiddleware");
const logOutRouter = require("./routes/logoutRoute");
const followerRoute = require("./routes/followerRoute");
const refreshTokenRoute = require("./routes/refreshTokenRoute");
const commentsRoute = require("./routes/commentsRoute");
const notificationsRoute = require("./routes/notificitionsRoute");
const likeRoute = require("./routes/likeRouter");
const retweetContoller = require("./routes/retweetsRoute");
const cookieParser = require("cookie-parser");
const errorHandlerMiddleware = require("./middleware/error-handler-middleware");

app.use(express.json());
app.use(cookieParser());
//app.use(cors());

app.get("/", (req, res) => {
  res.send(`<h1>ur app is up and running</h1>`);
});

// genral routes
app.use("/api/auth", authRouter);
app.use("/api", refreshTokenRoute);
app.use("/api", logOutRouter);

// protected routes
app.use("/api/post", authMiddleware, postRouter);
app.use("/api/follow", authMiddleware, followerRoute);
app.use("/api/like", authMiddleware, likeRoute);
app.use("/api/comment", authMiddleware, commentsRoute);
app.use("/api/retweet", authMiddleware, retweetContoller);
app.use("/api/notify", authMiddleware, notificationsRoute);

// error handling middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.port || 3500;

const start = async () => {
  try {
    await connectdb(process.env.MONGO_URI);
    app.listen(PORT, console.log(`server running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
