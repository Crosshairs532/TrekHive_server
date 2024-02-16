const express = require('express');
const wishlist = express.Router();
const { WishlistCollection } = require('./mongodb')


wishlist.get('/wishlist', async (req, res) => {
    const filter = {}
    if (req.query?.email) {
        filter.email = req.query?.email;
    }
    const result = await WishlistCollection.find(filter).toArray();
    res.send(result);
})

wishlist.post('/', async (req, res) => {
    const wish = req.body;
    const result = await WishlistCollection.insertOne(wish)
    res.send(result);
})
wishlist.delete('/', async (req, res) => {
    const { id } = req.query;
    const filter = { _id: new ObjectId(id) };
    const result = await WishlistCollection.deleteOne(filter);
    res.send(result);
})

module.exports = wishlist;