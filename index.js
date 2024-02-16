const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;
const stories = require('./utility/stories');
const wishlist = require('./utility/wishlist');
const admin = require('./utility/admin');
const verifyToken = require('./utility/verifyToken');
const check = require('./utility/check');
const booking = require('./utility/booking');
const jwtToken = require('./utility/jwt');
const { AllusersCollection,
    PackagesCollection,
    tourGuidesCollection,
} = require('./utility/mongodb');
require('dotenv').config();
app.use(cors());
app.use(express.json())
app.get('/', (req, res) => {
    res.send('TrekHive Server is running')
})
app.get('/guides', async (req, res) => {
    const { id } = req.query;
    const filter = {};
    if (id) {
        filter._id = new ObjectId(id)
    }
    const result = await tourGuidesCollection.find(filter).toArray();
    res.send(result);
})
app.get('/packages', async (req, res) => {
    const { id, count, tour } = req.query;
    console.log(typeof (count), "hi");
    let filter = {};
    if (id) {
        filter._id = new ObjectId(id);
    }
    if (tour) {
        filter.tourType = { $regex: tour, $options: 'i' };
    }

    const result = await PackagesCollection.find(filter).limit(parseInt(count)).toArray();
    console.log(result);
    res.send(result);
})
app.post('/users', async (req, res) => {
    const user = req.body;
    console.log(user);
    const exist = await AllusersCollection.findOne({ email: user?.email });
    if (exist) {
        return res.send({ message: 'already exist' })
    }

    const result = await AllusersCollection.insertOne(user);
    res.send(result)
})
app.use('/jwt', jwtToken);
app.use('/booking', booking)
app.use('/check', check);
app.use('/admin', admin);
app.use('/wishlist', wishlist);
app.use('/stories', stories);
app.listen(port, () => {
    console.log('TrekHive Server is running on', port);
})