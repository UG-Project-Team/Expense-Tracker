
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/login_database');


const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  
});

const User = mongoose.model('User', userSchema);


app.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

   
    const user = new User({ fullName, email, password });
 
    try {
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(400).send('Error registering user');
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

  
    if (password === user.password) {
        const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
        res.json({ token, fullName: user.fullName, email: user.email });
    } else {
        res.status(401).send('Invalid email or password');
    }
});

app.listen(5000, () => {
    console.log('Server running...');
});
