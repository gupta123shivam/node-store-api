require("dotenv").config();
// async errors
require("express-async-errors");

const express = require("express");
const app = express();
// const morgan = require('morgan')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const PORT = process.env.PORT || 5001;
const productsRouter = require("./routes/products");

// COnnect to Database
// connectDB();

// Third-party& Express middlewares
// app.use(morgan('tiny'))
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send(
    '<h1>Store API</h1> <a href="/api/v1/products">product route</a><br/><h1>See the <a href="https://documenter.getpostman.com/view/25672427/2s935vkf4j" terget="_blank" >Docs</a> to use this API</h1>'
  );
});

// product route
app.use("/api/v1/products", productsRouter);

// errorHandlers
app.use(require("./middleware/not-found"));
app.use(require("./middleware/error-handler"));

// Connect to Database and start the server
// mongoose.connection.once('open', ()=>{
//   console.log('Connected to MongoDB....')
//   app.listen(PORT, ()=>{
//     console.log('Express running at post '+ PORT)
//   })
// })

const startServer = async () => {
  try {
    connectDB();
    mongoose.connection.once("open", () => console.log("Connected to MongoDB"));
    app.listen(PORT, () => {
      console.log("Express running at post " + PORT);
    });
  } catch (err) {
    console.log(err.message);
  }
};

// Starting the server
startServer();

module.exports = app;
