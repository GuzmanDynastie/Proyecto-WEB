const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    images: [{ type: String, required: true }],
    piece: { type: Number, required: true },
    stock: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    expiration: { type: Date, required: true },
    principalCharacteristics: { type: String, required: false, default: ''},
    petCharacteristics: [{ 
        type: String, 
        required: false, 
        default: '' 
    }],
    specifications: [{ 
        type: String, 
        required: false, 
        default: '' 
    }],
    generalCharacteristics: [{ 
        type: String, 
        required: false, 
        default: '' 
    }],
    others: [{ 
        type: String, 
        required: false, 
        default: '' 
    }],
    description: { type: String, required: true },
    status: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('product', productSchema);