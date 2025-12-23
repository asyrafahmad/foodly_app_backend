// Controller for Category-related endpoints.
// Each exported function is an Express-style handler (req, res).
// This file uses the Mongoose `Category` model to perform DB operations.

const Category = require('../models/Category');

module.exports = {
    // Create a new category
    // Expected input: req.body should contain the fields defined in the Category schema,
    // e.g. { title: 'Fruits', value: 'fruits', ... }
    // Success response: 201 with a JSON success message
    // Error response: 500 with the error message
    createCategory: async (req, res) => {

        // Instantiate a Mongoose model with the request body
        const newCategory = new Category(req.body);

        try {
            // Save the document to MongoDB
            await newCategory.save();

            // Return a 201 Created response. We return a small status object rather than
            // the created document to keep the response compact. If you prefer returning
            // the created document, replace this with: res.status(201).json(newCategory)
            res.status(201).json({
                status: true,
                message: "Category created successfully"
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

    // Get all categories except a specific one (here title !== 'More')
    // This handler returns an array of category documents.
    getAllCategories: async (req, res) => {
        try {
            // Second argument to `find` is the projection: { __v: 0 } excludes the
            // Mongoose internal version key from the returned documents.
            // The query uses $ne (not equal) to filter out documents with title 'More'.
            // const categories = await Category.find({ title: { $ne: "More" } }, { __v: 0 });
            const categories = await Category.find({ __v: 0 });

            // Respond with the array of categories and HTTP 200 OK
            res.status(200).json(categories);
        } catch (error) {
            // On database/query errors return 500 and the error message
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    },

    // Return a small, randomized selection of categories plus a "more" category if present.
    // Intended behavior:
    //  - pick 4 random categories where value != 'More'
    //  - append the 'more' category (value: 'more') if it exists
    getRandomCategories: async (req, res) => {
        try {
            // NOTE: Mongoose aggregation stages must use $-prefixed operators.
            // The original code used {match: ...} which is incorrect; the correct stage
            // is { $match: { ... } } as used below. If your original code worked,
            // double-check the Mongoose version; otherwise use $match to avoid silent failures.
            let categories = await Category.aggregate([
                { $match: { value: { $ne: "More" } } },
                { $sample: { size: 4 } }
            ]);

            // Find the 'more' category by value. Projection again excludes __v.
            // Be mindful of case sensitivity: this searches for value exactly 'more'.
            const moreCategory = await Category.findOne({ value: "more" }, { __v: 0 });

            if (moreCategory) {
                // Append the special "more" category to the result list
                categories.push(moreCategory)
            }

            // Return the randomized selection + optional more category
            res.status(200).json(categories);
        } catch (error) {
            // IMPORTANT: The original catch block was empty which hides errors.
            // We return a 500 response so clients (and you while debugging) see failures.
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }
};