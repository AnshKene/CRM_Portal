import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Client', 'CEO', 'Admin', 'Employee'],
        default: 'Client'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model using the schema
const User = mongoose.model('User', userSchema);

export default User;

