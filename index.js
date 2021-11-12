const express = require("express");
const app = express();
const port = 8000;
const db = require("./config/mongoose");
const User = require("./models/user");
const passport = require("passport");
const passportJWT = require("./config/passport-jwt-strategy");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./api_doc.json")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//  use express router
app.use("/", require("./routes/index"));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server : ${err}`);
    return;
  }
  console.log(`Server is running on port : ${port}`);
});
