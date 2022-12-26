const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cwm2b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect();
        // await client.connect();
        const listItem = client.db('listItem').collection('item');

        app.get('/item', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const items = await listItem.find(query).toArray();
            res.send(items);
        })

        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const item = await listItem.insertOne(newItem);
            res.send(item);
        })

        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletes = await listItem.deleteOne(query);
            res.send(deletes);
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})