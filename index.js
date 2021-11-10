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

                // POST API:
                app.post('/products', async (req, res) => {
                        const product = req.body;
                        console.log('Hit The API', product);

                        const result = await productsCollection.insertOne(product);
                        console.log(result);
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