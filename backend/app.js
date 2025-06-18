import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

const app = express();
const __dirname = path.resolve();
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  Credential: true,
};

//required router files
import userRouter from "./routes/user.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import emailRouter from "./routes/send-email.routes.js";
import brandingRouter from "./routes/branding.routes.js";
import branchRouter from "./routes/branch.routes.js";
import currencyRouter from "./routes/currency.routes.js";
import loginRouter from "./routes/login.routes.js";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

//route level middlewares
app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/send-email", emailRouter);
app.use("/api/branding", brandingRouter);
app.use("/api/branch", branchRouter);
app.use("/api/currency", currencyRouter);
app.use("/api/login", loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
