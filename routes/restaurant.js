const Restaurant = require('../models/Restaurant');

module.exports = {
    // Create a new restaurant
    // Expected input: req.body should contain the fields defined in the Restaurant schema,
    // e.g. { title: 'Pizza Place', time: '30-40 mins', ... }
    // Success response: 201 with a JSON success message
    // Error response: 500 with the error message
    addRestaurant: async (req, res) => { 

        const { title, time, imageUrl, owner, code, logoUrl, coordinates } = req.body;

        if(!title || !time || !imageUrl || !owner || !code || !logoUrl || !coordinates || !coordinates.latitude || !coordinates.longitude || !coordinates.address || !coordinates.title) {
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

    getAllNearbyRestaurants: async (req, res) => {
        try {
            const nearbyRestaurants = await Restaurant.find({ isAvailable: true }, { __v: 0 }); 
            res.status(200).json(nearbyRestaurants);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    getRandomRestauirants: async (req, res) => {
        try {
            const count = await Restaurant.countDocuments();    
            const random = Math.floor(Math.random() * count);
            const randomRestaurants = await Restaurant.find().skip(random).limit(4);
            res.status(200).json(randomRestaurants);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
    
    // Get all restaurants
    // This handler returns an array of restaurant documents.
    getAllRestaurants: async (req, res) => {
        try {
            // Second argument to `find` is the projection: { __v: 0 } excludes the
            // Mongoose internal version key from the returned documents.
            const restaurants = await Restaurant.find({}, { __v: 0 });
            // Respond with the array of restaurants and HTTP 200 OK
            res.status(200).json(restaurants);
        } catch (error) {
            // On database/query errors return 500 and the error message
            res.status(500).json({
                status: false,
                message: error.message
            })
        }  
    },
};