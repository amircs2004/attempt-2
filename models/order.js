const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: {
        //.Mixed accepes any datastructure and its gratefull ahh wont throw any error
        type: [mongoose.Schema.Types.Mixed], 
        default: []
    },
    status: {
        type: String,
        default: 'active'
    }
}, { timestamps: true });

// Always call the database connection function with any MongoDB method
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);