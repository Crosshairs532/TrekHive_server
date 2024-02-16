const express = require('express');
const stories = express.Router();
const { StoryCollection } = require('./mongodb')
stories.get('/', async (req, res) => {
    const { id } = req.query;
    console.log(id);
    const filter = {};
    console.log(filter);
    if (id) {
        filter._id = new ObjectId(id);
    }
    try {
        const result = await StoryCollection.find(filter).toArray();
        console.log(result);
        res.send(result)
    }
    catch (err) {
        res.sendStatus(500)
    }

})


module.exports = stories;
