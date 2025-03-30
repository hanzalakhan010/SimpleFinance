const mongoose = require("mongoose");
const express = require("express");
require('dotenv').config();
const cors = require("cors");
const Transactions = require("./models/transactionModel");
const Categories = require("./models/categoryModel");

app = express();
app.use(express.json());
app.use(cors());

app.get("/transactions", async (req, res) => {
  try {
    let transactions = await Transactions.find({});
    res.status(200).json(transactions);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
  
});

app.post("/transactions", async (req, res) => {
  try {
    let transaction = await Transactions.create(req.body)
    res.status(201).json(transaction);

  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
})
app.get('/categories', async (req, res) => {
  try {
    let categories = await Categories.find({});
    res.status(200).json(categories);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
})



const uri = process.env.MONGODB_URI
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log(`Node API app is running on port 3000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
