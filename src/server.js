require("express-async-errors");
const express = require("express");

const database = require("./database/sqlite");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const routes = require("./routes");

database();

const app = express();
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER));

app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.log(error);

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
