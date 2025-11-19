const moongoose = require("mongoose");

const CartSchema = new moongoose.Schema({

    userId: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productId: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
    },
    additives: {type: Array, required: false, default: []},
    totalPrice: {type: Number, required: true},
    quantity: {type: Number, required: true, default: 1},

}, {timestamps: true});

module.exports = moongoose.model("Cart", CartSchema);