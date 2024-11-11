const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/request_details', { useNewUrlParser: true, useUnifiedTopology: true });

// Expense Schema
const expenseSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    description: String
});

const Expense = mongoose.model('Expense', expenseSchema);

// Add Expense Endpoint
app.post('/add-expense', async (req, res) => {
    const { name, amount, description } = req.body;

    const expense = new Expense({ name, amount, description });
    try {
        await expense.save();
        res.status(201).send('Expense added successfully');
        
    } catch (err) {
        res.status(400).send('Error adding expense');
    }
});

// Get All Expenses
app.get('/get-expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).send('Error fetching expenses');
    }
});


// Start Server
app.listen(4000, () => {
    console.log('Server running...');
});
