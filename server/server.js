const mongoose = require("mongoose");

const uri =
  "mongodb+srv://hanzalakhan010:mongoPass-72270@mycluster.v1vcuue.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
