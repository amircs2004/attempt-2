const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: Number,  // SOON WHEN I WILL INTEGRATE ALGERIAN PRODUCTS IN BDD I WILL CHANGE IF to objectId and ref to Product
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: {
        //.Mixed accepes any datastructure and its gratefull ahh wont throw any error
        type: [orderItemSchema], 
        default: []
    },
    status: {
        type: String,
        default: 'active'
    } ,
    // i have to add the location of client and the coordinates of the driver to the order schema so that the driver can see the location of the client and the client can see the location of the driver

    location: {
        type: {
            type: String,
            enum: ['Point'],
            
        },

        coordinates: {
            type: [Number], // Expects [longitude, latitude]
            required: false
        } 
    }

}, { timestamps: true });

////  TTL INDEX: MongoDB deletes this cart 24 hours (86,400s) after its last update
orderSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 } );
// SPATIAL INDEX: Required for $geoNear spatial queries to run fast!
orderSchema.index({ location: '2dsphere' });

// Always call the database connection function with any MongoDB method
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema , 'confirmedorders');