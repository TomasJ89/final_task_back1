const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Conversation Schema
const conversationSchema = new Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // Array of users participating in the conversation
    messages: [{
        text: { type: String, required: true }, // The content of the message
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
        date: { type: Date, default: Date.now }, // Date when the message was sent
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of users who liked the message
    }],
    createdAt: { type: Date, default: Date.now } // Date when the conversation was created
});

// Create the Conversation model
const conversation = mongoose.model('conversation', conversationSchema);

module.exports = conversation;