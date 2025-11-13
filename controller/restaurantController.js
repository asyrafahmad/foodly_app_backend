const Restaurant = require('../models/Restaurant');

module.exports = {
    // Create a new restaurant
    // Expected input: req.body should contain the fields defined in the Restaurant schema,
    // e.g. { title: 'Pizza Place', time: '30-40 mins', ... }
    // Success response: 201 with a JSON success message
    // Error response: 500 with the error message
    addRestaurant: async (req, res) => { 

        const { title, time, imageUrl, owner, code, logoUrl, rating, ratingCount, coordinates } = req.body;

        if(!title || !time || !imageUrl || !owner || !code || !logoUrl || !rating || !ratingCount || !coordinates || !coordinates.latitude || !coordinates.longitude || !coordinates.address || !coordinates.title) {
            return res.status(400).json({
                status: false,
                message: "Missing required fields"
            });
        }

        // Instantiate a Mongoose model with the request body
        const newRestaurant = new Restaurant(req.body);
        try {
            // Save the document to MongoDB
            await newRestaurant.save();
            // Return a 201 Created response. We return a small status object rather than
            // the created document to keep the response compact. If you prefer returning
            // the created document, replace this with: res.status(201).json(newRestaurant)
            res.status(201).json({
                status: true,
                message: "Restaurant created successfully"
            })
        }   
        catch (error) {
            // Generic server error. In production you might map certain validation
            // errors to 400 Bad Request instead of 500.
            res.status(500).json({
                status: false,
                message: error.message
            })
        }   
    },

    getRestaurantById: async (req, res) => {
        const restaurantId = req.params.id;
        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({
                    status: false,
                    message: "Restaurant not found"
                });
            }
            res.status(200).json(restaurant);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    getRandomRestaurants: async (req, res) => {
        
        const code = req.params.code;

        try {
            let randomRestaurant = [];

            if(code) {
                randomRestaurant = await Restaurant.aggregate([
                    { $match: { code: code, isAvailable : true }},
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }
            
            if(randomRestaurant.length === 0) {
                randomRestaurant = await Restaurant.aggregate([
                    { $match: { isAvailable : true }},
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }
            res.status(200).json(randomRestaurant);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    getAllNearbyRestaurants: async (req, res) => {
        const code = req.params.code;

        try {
            let allNearbyRestaurants = [];

            if(code) {
                allNearbyRestaurants = await Restaurant.aggregate([
                    { $match: { code: code, isAvailable : true }},
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }
            
            if(allNearbyRestaurants.length === 0) {
                allNearbyRestaurants = await Restaurant.aggregate([
                    { $match: { isAvailable : true }},
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }
            res.status(200).json(allNearbyRestaurants);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
    
   
};