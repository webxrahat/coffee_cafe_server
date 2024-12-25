const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.jhexa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
 serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
 },
});

async function run() {
 try {
  await client.connect();

  const bookCollection = client.db("booksdb").collection("books");

  app.post("/books", async (req, res) => {
   const book = await req.body;
   const result = await bookCollection.insertOne(book);
   res.send(result);
   //  console.log(book);
  });

  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
 } finally {
 }
}
run().catch(console.dir);

app.get("/", (req, res) => {
 res.send("Hello World!");
});

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`);
});
