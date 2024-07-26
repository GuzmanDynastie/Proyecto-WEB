const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    id_user: { type: String, required: true },
    status_order: { type: String, required: true },
    token: { type: String, required: true },
    date_shopping: { type: Date, required: true },
    items: [{
        item_id: { type: String, required: true },
        product_name: { type: String, required: true },
        quentity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    free_shipping: { type: Boolean, required: true },
    total_price: { type: Number, required: true },
    address_information: { type: String, required: true }
});

module.exports = mongoose.model('orders', orderSchema);