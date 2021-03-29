const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edvmx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
 
app.post('/addProduct', (req, res)=>{
    const product =req.body;
    console.log(product);
    collection.insertOne(product)
    // collection.insertMany(product)
    .then(result =>{
      res.send(result.insertedCount)
    })
})

app.get('/products',(req, res)=>{
    collection.find({})
    .toArray( (err, documents)=>{
        res.send(documents);
    })
})

app.get('/product/:key',(req, res)=>{
    collection.find({key: req.params.key})
    .toArray( (err, documents)=>{
        res.send(documents[0]);
    })
})

app.post('/productsKeys', (req, res)=>{
    const productKeys = req.body;
    collection.find({key: { $in: productKeys}})
    .toArray( (err, documents)=>{
        res.send(documents);
    })
})

app.post('/addOrder', (req, res)=>{
    const order =req.body;
    ordersCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
})



});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})