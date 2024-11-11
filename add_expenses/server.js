const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/finance', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB 'finance' database");
}).catch(err => console.log("Database connection error:", err));

// Define the schema for entries
const entrySchema = new mongoose.Schema({
    day: String,
    data: Object
});

const Entry = mongoose.model('Entry', entrySchema);

// Route to save a new entry
app.post('/api/save-entry', async (req, res) => {
    const { day, data } = req.body;
    const newEntry = new Entry({ day, data });

    try {
        await newEntry.save();
        res.json({ message: 'Entry saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving entry', error });
    }
});

// Route to fetch all entries
app.get('/api/entries', async (req, res) => {
    try {
        const entries = await Entry.find();
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching entries', error });
    }
});

// Route to save changes for specific items with auto-save functionality
app.post('/api/save-changes', async (req, res) => {
    const updates = req.body.updates;

    try {
        for (const update of updates) {
            const { day, item, amount } = update;
            await Entry.updateOne(
                { day },
                { $set: { [`data.${item}`]: amount } }
            );
        }
        res.json({ message: 'Changes saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving changes', error });
    }
});
// Route to fetch weekly summaries
app.get('/api/weekly-summary', async (req, res) => {
    try {
        // Fetch all daily entries from the database
        const entries = await Entry.find();
        const weeklyData = {};

        // Group daily data into weekly summaries
        entries.forEach(entry => {
            const day = parseInt(entry.day.replace('day', ''), 10); // Extract day number
            const week = Math.ceil(day / 7); // Calculate week number
            if (!weeklyData[week]) {
                weeklyData[week] = {};
            }
            // Sum amounts for each item within the week
            for (const [item, amount] of Object.entries(entry.data)) {
                weeklyData[week][item] = (weeklyData[week][item] || 0) + amount;
            }
        });

        // Format the weekly summaries for the response
        const formattedData = Object.entries(weeklyData).map(([week, data]) => ({
            week: `Week ${week}`,
            data,
        }));

        // Send the weekly summary as JSON
        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weekly summary', error });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
