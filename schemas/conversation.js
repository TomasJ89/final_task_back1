const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const conversationSchema = new Schema({

    members: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId, // Assuming you want to store ObjectIds
            required: true
        },
        username: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        }
    }],
    messages: [{
        text: { type: String, required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, required: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, required: true },
        date: { type: Date, required: true },
        likes: [{
            user: { type: mongoose.Schema.Types.ObjectId, required: true },
            date: { type: Date, required: true }
        }]
    }],
    createdAt: { type: Date, default: Date.now }
});


const conversation = mongoose.model('conversation', conversationSchema);

module.exports = conversation;