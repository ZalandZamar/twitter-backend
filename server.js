const express = require("express");
const app = express();
const connectdb = require("./db/connectdb");
require("dotenv").config();
const authRouter = require("./routes/authRoute");
const notFound = require("./middleware/not-found");

app.get("/", (req, res) => {
  res.send(`<h1>ur app is up and running</h1>`);
});

app.use("/api/auth", authRouter);

// error handling middleware
app.use(notFound);

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
