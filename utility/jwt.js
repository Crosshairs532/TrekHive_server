const express = require('express');
const jwtToken = express.Router();
const jwt = require('jsonwebtoken');

jwtToken.post('/jwt', (req, res) => {
    const userEmail = req.body;
    const token = jwt.sign(userEmail, process.env.TOKEN_KEY, { expiresIn: '2h' });
    res.send({ token: token })
})

module.exports = jwtToken;