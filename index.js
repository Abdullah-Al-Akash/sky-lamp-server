const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Setup MongoDB Database:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7gqmj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Set Middleware:
app.use(express.json());
app.use(cors());

// Main Function For MongoDB:
async function run() {
        try {
                await client.connect();
                console.log("Database Connected MongoDB")
                const database = client.db('SKY_LAMP');
                const productsCollection = database.collection('product');
                // Orders Collection:
                const orderCollection = database.collection('orders');

                // GET All Products API:
                app.get('/products', async (req, res) => {
                        const cursor = productsCollection.find({});
                        const products = await cursor.toArray();
                        res.send(products);
                })

                // GET Single Product:
                app.get('/products/:id', async (req, res) => {
                        const id = req.params.id;
                        console.log("Getting Specific Service", id)
                        const query = { _id: ObjectId(id) };
                        const product = await productsCollection.findOne(query);
                        res.json(product);
                })

                // POST Products API:
                app.post('/products', async (req, res) => {
                        const product = req.body;
                        console.log('Hit The API', product);

                        const result = await productsCollection.insertOne(product);
                        console.log(result);
                        res.json(result);
                });

                // Orders Collection
                // Add Orders API:
                app.post('/orders', async (req, res) => {
                        const order = req.body;
                        const result = await orderCollection.insertOne(order);
                        res.json(result);
                })

                // Update Status:
                app.put('/orders/:id', async (req, res) => {
                        const id = req.params.id;
                        const updateStatus = req.body;
                        const filter = { _id: ObjectId(id) }
                        const options = { upsert: true };
                        // create a document that sets the plot of the movie
                        const updateDoc = {
                                $set: {
                                        status: 'Shipped'
                                },
                        };
                        const result = await orderCollection.updateOne(filter, updateDoc, options);
                        console.log("Updating User", req)
                        res.json(result)
                })

                // GET ALL Orders:
                app.get('/orders', async (req, res) => {
                        const cursor = orderCollection.find({})
                        const orders = await cursor.toArray();
                        res.send(orders);
                })
                // Delete Operation:
                app.get('/orders/:id', async (req, res) => {
                        const id = req.params.id;
                        const query = { _id: ObjectId(id) };
                        const result = await orderCollection.findOne(query)
                        res.json(result);
                })

                app.delete('/orders/:id', async (req, res) => {
                        const id = req.params.id;
                        const query = { _id: ObjectId(id) };
                        const result = await orderCollection.deleteOne(query)
                        res.json(result);
                })
        }
        finally {
                // client.close();
        }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
        res.send('Successfully Sky Lamp Server');
})

app.listen(port, () => {
        console.log('Successfully Sky Lamp Server on Port', port);
})
// Thank You