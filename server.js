const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const bodyParser = require("body-parser");
const assert = require("assert");
const app = express();
app.use(bodyParser.json());
const mongo_url = "mongodb://localhost:27017";
const dataBase = "contact-list";
MongoClient.connect(mongo_url, { useUnifiedTopology: true }, (err, client) => {
  assert.equal(err, null, "data base connexion failed");
  const db = client.db(dataBase);

  app.post("/new_contact", (req, res) => {
    let newContact = req.body;
    db.collection("contact").insertOne(newContact, (err, data) => {
      if (err) res.send("cant add  new Contact List");
      else res.send(data);
    });
  });
  app.get("/contacts", (req, res) => {
    db.collection("contact").find().toArray((err, data) => {
      if (err) res.send("cant not get Contact List");
      else res.send(data);
    });
  });

  app.get("/contacts/:id", (req, res) => {
    let id = ObjectID(req.params.id);
    db.collection("contact").findOne({ _id: id }, (err, data) => {
      if (err) res.send("cant not get Contact List");
      else res.send(data);
    });
  });
  
  app.put("/contacts/:id", (req, res) => {
    let id = ObjectID(req.params.id);
    let modified = req.body;
    db.collection("contact").findOneAndUpdate(
      { _id: id },
      { $set: { ...modified } },
      (err, data) => {
        if (err) res.send("cont modify contact list");
        else res.send(data);
      }
    );
  });
  app.delete("/contacts/:id", (req, res) => {
    let id = ObjectID(req.params.id);
    db.collection("contact").findOneAndDelete({ _id: id }, (err, data) => {
      if (err) res.send("cont delete contact list");
      else res.send(data);
    });
  });
});
app.listen(4000, err => {
  if (err) console.log(" Our office is not open now");
  else console.log("Welcome to our office ");
});
