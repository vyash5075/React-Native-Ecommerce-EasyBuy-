const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
// app.use(cors());
// app.options('*', cors())

// Setup CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//middleware
app.use(express.json()); //this will make our data be understandable by express which are sent from frontend
app.use(morgan("tiny")); //log frontend requests
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
//app.use(authJwt);

//ROUTES
const productrouter = require("./routers/product");
const categoriesRoutes = require("./routers/categories");
const userRoutes = require("./routers/user");
const orderRoutes = require("./routers/order");
const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productrouter);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, orderRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database connection is ready...");
  })
  .catch((err) => console.log(err));

//SERVER LISTEN
app.listen(process.env.PORT || 3001, () => {
  console.log(`server is running on port  3000 https://localhost:3000`);
});
