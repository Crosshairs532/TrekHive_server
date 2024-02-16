const express = require('express');
const check = express.Router();
const verifyToken = require('./verifyToken');
const { AllusersCollection } = require('./mongodb');

// check Admin

check.get('/admin', verifyToken, async (req, res) => {
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

// ========= Tour Guide Check =============
check.get('/check/guide', verifyToken, async (req, res) => {
    const { email } = req.query;
    const DecodeEmail = req.decode.email;
    console.log(email);
    if (email != DecodeEmail) {
        return res.status(403).send({ message: 'forbidden access' })
    }
    const filter = { email: email };
    const exist = await AllusersCollection.findOne(filter);
    let guide = false;
    if (exist) {
        guide = exist.role == 'guide';
    }
    return res.send(guide)
})



module.exports = check 