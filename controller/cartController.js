const { get } = require("mongoose");
const Cart = require("../models/Cart");
const { count } = require("../models/Rating");

module.exports = {
    addProductToCart: async (req, res) => {

        const userId = req.user.id;
        const {productId, additives, totalPrice, quantity} = req.body;

        if(!productId || !totalPrice || !quantity) {
            return res.status(400).json({
                status: false,
                message: "Missing required fields"
            });
        }

        try {
            const existingProduct = await Cart.findOne({ userId: userId, productId: productId});
            let count = await Cart.countDocuments({ userId: userId });

            if (existingProduct) {

                existingProduct.quantity += quantity;
                existingProduct.totalPrice += totalPrice;

                await existingProduct.save();

                return res.status(200).json({
                    status: true,
                    count: count,
                    message: "Cart updated successfully"
                });
            } else {
                
                const newCartItem = new Cart({
                    userId: userId,
                    productId: productId,
                    additives: additives || [],
                    totalPrice: totalPrice,
                    quantity: quantity
                });

                await newCartItem.save();
                count = await Cart.countDocuments({ userId: userId });

                return res.status(201).json({
                    status: true,
                    count: count,
                    message: "Item added to cart successfully"
                });
            }   

        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
    
    removeCart: async (req, res) => {

        const cartItemId = req.params.id;
        const userId = req.user.id;

        try {
            
            const cartItem = await Cart.findById(cartItemId);
            
            if (!cartItem) {
                return res.status(404).json({
                    status: false,
                    message: "Cart item not found"
                });
            }
            
            await Cart.findByIdAndDelete(cartItemId);

            const count = await Cart.countDocuments({ userId: userId });

            res.status(200).json({
                status: true,
                count: count,
                message: "Cart item successfully removed"
            });
        } catch (error) {
            res.status(500).json({
                status: false,  
                message: error.message
            });
        }
    },

    getCart: async (req, res) => { 

        const userId = req.user.id;

        try {
            const cartItems = await Cart.find({ userId: userId })
                                        .populate({
                                            path: 'productId', 
                                            select: 'imageUrl title restaurant rating ratingCount', 
                                            populate: {
                                                path: 'restaurant', 
                                                select: 'time coords'
                                            }
                                        });

            res.status(200).json(cartItems);
        }
        catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }   
    },

    getCartCount: async (req, res) => {

        const userId = req.user.id;
        try {
            const count = await Cart.countDocuments({ userId: userId });
            res.status(200).json({ 
                status: true, 
                count: count 
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    decrementProductQuantity: async (req, res) => {

        const userId = req.user.id;
        const productId = req.params.id;

        try {
            const cartItem = await Cart.findById(productId);
            if (!cartItem) {
                return res.status(404).json({
                    status: false,
                    message: "Cart item not found"
                });
            } else {
                const productPrice = cartItem.totalPrice / cartItem.quantity;
                
                if(cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                    cartItem.totalPrice -= productPrice;
                    await cartItem.save();

                    return res.status(200).json({
                        status: true,
                        message: "Product quantity decremented",
                        data: cartItem
                    });
                }
                else {
                    await Cart.findByIdAndDelete({_id: productId});
                    
                    return res.status(200).json({
                        status: true,
                        message: "Product removed from cart as quantity reached zero"
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }

};