//imports externals
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
// initialize
const app = express();
const port = process.env.PORT || 5000;
// middlewares
app.use(cors());
app.use(express.json());

// connecting database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oe1j3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //collections
    const productsCollection = client
      .db("assignment-automous")
      .collection("products");
    const bookedProductsCollection = client
      .db("assignment-automous")
      .collection("bookedProducts");

    // routes
    app.get("/products", async (req, res) => {
      const query = {};
      const allProducts = await productsCollection.find(query).toArray();
      res.send(allProducts);
    });

    app.get("/bookedProducts", async (req, res) => {
      const query = {};
      const allBookedProducts = await bookedProductsCollection
        .find(query)
        .toArray();
      res.send(allBookedProducts);
    });

    app.post("/products", async (req, res) => {
      const doc = req.body;
      const result = await bookedProductsCollection.insertOne(doc);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: id };
      const result = await bookedProductsCollection.deleteOne(filter);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          availability: false,
          mileage: req.body.milage,
        },
      };
      const response = await productsCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(response);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          availability: true,
          durability: req.body.durability,
        },
      };
      const response = await productsCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(response);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

//starting the server
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
