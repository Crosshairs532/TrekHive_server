const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;
const jwt = require('jsonwebtoken')
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
const BookingsCollection = client.db('TrekHive').collection('Bookings');
const WishlistCollection = client.db('TrekHive').collection('Wishlists');
const tourGuidesCollection = client.db('TrekHive').collection('TourGuides');



const verifyToken = (req, res, next) => {
    const tokenn = req.headers.authorization;
    console.log(tokenn, "token");
    // console.log(req.headers);
    if (!tokenn) {
        return res.status(401).send({ message: 'Unauthorized' })
    }
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized' })
        }
        req.decode = decoded;
        next();
    })
}

// check Admin

app.get('/check/admin', verifyToken, async (req, res) => {
    const { email } = req.query;
    const DecodeEmail = req.decode.email;
    console.log(email);
    if (email != DecodeEmail) {
        return res.status(403).send({ message: 'forbidden access' })
    }
    const filter = { email: email };
    const exist = await AllusersCollection.findOne(filter);
    let admin = false;
    if (exist) {
        admin = exist.role == 'admin';
    }
    return res.send(admin)
})

// admin
app.get('/admin/users', async (req, res) => {
    const { email } = req.query;
    const result = await AllusersCollection.find({ email: { $ne: email } }).toArray();
    res.send(result);
})
app.post('/admin/package', async (req, res) => {
    const package = req.body;
    const result = await PackagesCollection.insertOne(package);
    res.send(result)

})
app.patch('/admin/users', async (req, res) => {
    const { id, role } = req.query;
    const filter = { _id: new ObjectId(id) };
    const update = {
        $set: {
            role: role
        }
    }
    const result = await AllusersCollection.updateOne(filter, update);
    res.send(result);

})











app.get('/', (req, res) => {
    res.send('TrekHive Server is running')
})
app.get('/packages', async (req, res) => {
    const { id, count } = req.query;
    console.log(typeof (count), "hi");
    let filter = {};
    if (id) {
        filter._id = new ObjectId(id);
    }

    const result = await PackagesCollection.find(filter).limit(parseInt(count)).toArray();
    console.log(result);
    res.send(result);
})
app.get('/booking', async (req, res) => {
    const { email } = req.query;
    const userEmail = email;
    const filter = {};
    if (userEmail) {
        filter.TouristEmail = userEmail;
    }
    const result = await BookingsCollection.find(filter).toArray();
    res.send(result);
})

app.get('/wishlist', async (req, res) => {
    const filter = {}
    if (req.query?.email) {
        filter.email = req.query?.email;
    }
    const result = await WishlistCollection.find(filter).toArray();
    res.send(result);
})


app.post('/jwt', (req, res) => {
    const userEmail = req.body;
    const token = jwt.sign(userEmail, process.env.TOKEN_KEY, { expiresIn: '2h' });
    res.send({ token: token })
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
app.post('/booking', async (req, res) => {
    const booking = req.body;
    const result = await BookingsCollection.insertOne(booking);
    res.send(result);
})
app.post('/wishlist', async (req, res) => {
    const wish = req.body;
    const result = await WishlistCollection.insertOne(wish)
    res.send(result);
})
app.delete('/wishlist', async (req, res) => {
    const { id } = req.query;
    const filter = { _id: new ObjectId(id) };
    const result = await WishlistCollection.deleteOne(filter);
    res.send(result);
})
app.listen(port, () => {
    console.log('TrekHive Server is running on', port);
})

