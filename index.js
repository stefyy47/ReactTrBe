const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/buildings", async (req, res) => {
  const { MongoClient } = require("mongodb");
  const client = new MongoClient(
    "mongodb+srv://stefyy47:v4z482iD18HCU2eS@cluster0.gmn33w6.mongodb.net/?retryWrites=true&w=majority"
  );
  const database = client.db("Travian");
  const informations = database.collection("BuildingsInfo");
  const sal = await informations.findOne({ title: "sal" });
  console.log(sal);
  res.send(sal);
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
