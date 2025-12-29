const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

mongoose.connect('mongodb://127.0.0.1:27017/critic_db')
  .then(() => console.log("Success! The Waiter and Chef are talking."))
  .catch(err => console.log("Error: The Chef is not answering...", err));

const logSchema = new mongoose.Schema({
    movie_id: Number,
    title: String,
    rating: Number,
    review: String,
    watched_on: String,
    liked: Boolean
});

const Log = mongoose.model('Log', logSchema);

app.post('/api/logs', async (req, res) => {
    try {
        const newLog = new Log(req.body);
        await newLog.save();
        res.status(201).send("Review Saved to the Database!"); 
    } catch (err) {
        res.status(500).send("Oops! The Chef dropped the plate.");
    }
});

app.listen(3000, () => {
  console.log("The Waiter is standing at Table 3000!");
});