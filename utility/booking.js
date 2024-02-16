const express = require('express');
const booking = express.Router()



booking.get('/', async (req, res) => {
    const { email } = req.query;
    const userEmail = email;
    const filter = {};
    if (userEmail) {
        filter.TouristEmail = userEmail;
    }
    const result = await BookingsCollection.find(filter).toArray();
    res.send(result);
})
booking.post('/', async (req, res) => {
    const booking = req.body;
    const result = await BookingsCollection.insertOne(booking);
    res.send(result);
})

module.exports = booking;