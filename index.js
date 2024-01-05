const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;
require('dotenv').config();
app.use(cors());
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
console.log(process.env.DB_USER);
const uri = 'mongodb+srv://trekhive:n5QZQGRJ8jd0UkRa@cluster0.wtx9jbs.mongodb.net/TrekHive?retryWrites=true&w=majority';
// DB_USER=trekhive
// DB_password=hrms6WzGW6eV39ML 

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const Dbconnect = async () => {
    try {
        await client.connect()
        console.log('TrekHive Database Connected Successfully');
    }
    catch (error) {
        console.log(error.name, error.message);
    }
}
Dbconnect();

const AllusersCollection = client.db('TrekHive').collection('users');
const PackagesCollection = client.db('TrekHive').collection('packages');

app.get('/', (req, res) => {
    res.send('TrekHive Server is running')
})
app.get('/packages', async (req, res) => {
    const { id } = req.query;
    console.log(id, "hi");
    let filter = {};
    if (id) {
        filter._id = new ObjectId(id);
    }
    const result = await PackagesCollection.find(filter).toArray();
    console.log(result);
    res.send(result);
})


app.post('/users', async (req, res) => {
    const user = req.body;
    const exist = await AllusersCollection.findOne({ email: user?.email });
    if (exist) {
        res.send({ message: 'already exist' })
    }
    else {
        const result = await AllusersCollection.insertOne(user);
        res.send(result)
    }
})







app.listen(port, () => {
    console.log('TrekHive Server is running on', port);
})

