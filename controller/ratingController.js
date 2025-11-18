const Rating = require('../models/Rating');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');

module.exports = {

    addRating: async (req, res) => {

        const newRating = new Rating({
            userId: req.user.id,
            ratingType: req.body.ratingType,
            product: req.body.product,
            rating: req.body.rating, 
        });

        try {
            await newRating.save();
            
            if(req.body.ratingType === "Restaurant") {
                const restaurant = await Rating.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    {
                        $group: {
                            _id: "$product",
                            averageRating: { $avg: "$rating" }
                        }
                    }
                ]);

                if(restaurant.length > 0) {
                    const averageRating = restaurant[0].averageRating;

                    await Restaurant.findByIdAndUpdate(
                        req.body.product, 
                        { rating: averageRating },
                        { new: true }
                    );
                }
            } else if(req.body.ratingType === "Food") {
                 const food = await Rating.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    {
                        $group: {
                            _id: "$product",
                            averageRating: { $avg: "$rating" }
                        }
                    }
                ]);

                if(food.length > 0) {
                    const averageRating = food[0].averageRating;

                    await Food.findByIdAndUpdate(
                        req.body.product, 
                        { rating: averageRating },
                        { new: true }
                    );
                }
            }

            res.status(200).json({
                status: true,
                message: "Rating added successfully",
                data: newRating
            });
            
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }       
    },

    checkUserRating: async (req, res) => {

        const ratingType = req.query.ratingType;
        const productId = req.query.productId;
        
        try {
            const existingRating = await Rating.findOne({
                userId: req.user.id,
                ratingType: ratingType,
                product: productId
            });

            if (existingRating) {
                res.status(200).json({
                    status: true,
                    message: "You have already rated this restaurant",
                    hasRated: true,
                    rating: existingRating.rating
                });
            } else {
                res.status(200).json({
                    status: true,
                    message: "You have not rated this restaurant yet",
                    hasRated: false
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }
            
    
};