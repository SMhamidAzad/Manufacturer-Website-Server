const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.roc0q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();

    // all collection 
    const toolsCollection = client.db('toolsManufacturer').collection('tools');
    const orderCollection = client.db('toolsManufacturer').collection('orders');
    const reviewCollection = client.db('toolsManufacturer').collection('reviews');

    // tools api 
    app.get('/tools', async (req, res) => {
      const query = {};
      const result = await toolsCollection.find(query).toArray();
      res.send(result)
    })
    app.get('/tools/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await toolsCollection.findOne(query);
      res.send(result)
    })


    // orders api 
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const result = await orderCollection.insertOne(orders);
      res.send(result);
    })
    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })


    // review api 
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    })
    app.get('/review', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

  }
  finally {

  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})