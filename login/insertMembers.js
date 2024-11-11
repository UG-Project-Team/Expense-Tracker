const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Member, Target } = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route to add a member
app.post('/add-member', async (req, res) => {
    try {
        const { group, name, username, password } = req.body;
        if (!group || !name || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const member = new Member({ group, name, username, password });
        await member.save();
        res.status(201).json({ message: 'Member added successfully' });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ message: 'Failed to add member' });
    }
});

// Route to save targets
app.post('/save-targets', async (req, res) => {
    try {
        const { monthlyTarget, weeklyTarget } = req.body;
        if (monthlyTarget == null || weeklyTarget == null) {
            return res.status(400).json({ message: 'Both targets are required' });
        }

        const target = new Target({ monthlyTarget, weeklyTarget });
        await target.save();
        res.status(201).json({ message: 'Targets saved successfully' });
    } catch (error) {
        console.error('Error saving targets:', error);
        res.status(500).json({ message: 'Failed to save targets' });
    }
});

// Route to get suggestions
app.get('/get-suggestions', async (req, res) => {
    try {
        const suggestionsText = "AI-based insights on your expenses.";
        const suggestionsCount = 120; // Example count
        res.json({ suggestionsText, suggestionsCount });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ message: 'Failed to fetch suggestions.' });
    }
});

// Route to retrieve all members for display on the profile page
app.get('/get-members', async (req, res) => {
    try {
        const members = await Member.find(); // Fetch all members from the database
        res.json(members);
    } catch (error) {
        console.error('Error retrieving members:', error);
        res.status(500).json({ message: 'Failed to retrieve members' });
    }
});

// Route to retrieve the latest saved targets
app.get('/get-targets', async (req, res) => {
    try {
        const target = await Target.findOne().sort({ createdAt: -1 }); // Fetch the most recent targets
        if (!target) {
            return res.status(404).json({ message: 'No targets found' });
        }
        res.json(target);
    } catch (error) {
        console.error('Error retrieving targets:', error);
        res.status(500).json({ message: 'Failed to retrieve targets' });
    }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
