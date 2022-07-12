require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();

// Other packages.
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
//Connect Database
const connectDB = require("./db/connect");

//Routers.
const authRouter = require("./routes/authRoute");

//middleware
const notfoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v2/auth", authRouter);

app.use(notfoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 7000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
