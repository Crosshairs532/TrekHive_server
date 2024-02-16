//  admin
const express = require('express');
const admin = express.Router();
const { AllusersCollection,
    PackagesCollection,
    BookingsCollection,
    WishlistCollection,
    tourGuidesCollection,
    StoryCollection } = require('./mongodb')



admin.get('/users', async (req, res) => {
    const { email } = req.query;
    const result = await AllusersCollection.find({ email: { $ne: email } }).toArray();
    res.send(result);
})
admin.post('/package', async (req, res) => {
    const package = req.body;
    const result = await PackagesCollection.insertOne(package);
    res.send(result)

})
admin.patch('/users', async (req, res) => {
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
admin.post('/guides', async (req, res) => {
    const guide = req.body;
    const result = await tourGuidesCollection.insertOne(guide);
    res.send(result);

})

module.exports = admin;