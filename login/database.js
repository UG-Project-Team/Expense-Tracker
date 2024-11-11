const mongoose = require('mongoose');

// Connect to MongoDB with error handling
mongoose.connect('mongodb://localhost:27017/members', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(error => console.error('Failed to connect to MongoDB:', error));

// Define schemas
const MemberSchema = new mongoose.Schema({
    group: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const TargetSchema = new mongoose.Schema({
    monthlyTarget: { type: Number, required: true },
    weeklyTarget: { type: Number, required: true },
});

// Define models
const Member = mongoose.model('Member', MemberSchema);
const Target = mongoose.model('Target', TargetSchema);

module.exports = { Member, Target };
