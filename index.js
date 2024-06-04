const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/marketers', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define the schema and model
const marketerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    website: String,
    linkedin: String,
    experience: String,
    budget: Number
}, { timestamps: true });

const Marketer = mongoose.model('Marketer', marketerSchema);

// Routes
app.post('/api/marketers', async (req, res) => {
    try {
        const { email } = req.body;
        const existingMarketer = await Marketer.findOne({ email });
        if (existingMarketer) {
            return res.status(400).json({ message: 'Already submitted' });
        }
        const marketer = new Marketer(req.body);
        await marketer.save();
        res.status(201).json({ message: 'Thank you!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/marketers/count', async (req, res) => {
    try {
        const count = await Marketer.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/marketers', async (req, res) => {
    try {
        const marketers = await Marketer.find();
        res.json(marketers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});