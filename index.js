const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

  app.get("/books", async (req, res) => {
   const book = bookCollection.find();
   const result = await book.toArray();
   res.send(result);
  });

  app.get("/books/:id", async (req, res) => {
   const id = req.params.id;

   if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ID format" });
   }

   try {
    const query = { _id: new ObjectId(id) };
    const result = await bookCollection.findOne(query);
    if (!result) {
     return res.status(404).send({ error: "Book not found" });
    }
    res.send(result);
   } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).send({ error: "Internal Server Error" });
   }
  });

  app.delete("/books/:id", async (req, res) => {
   const id = req.params.id;

   if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ID format" });
   }

   try {
    const query = { _id: new ObjectId(id) };
    const result = await bookCollection.deleteOne(query);

    if (result.deletedCount === 0) {
     return res.status(404).send({ error: "Book not found" });
    }

    res.send({ message: "Book deleted successfully", result });
   } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send({ error: "Internal Server Error" });
   }
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
