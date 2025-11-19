const User = require("../models/User");
const Address = require("../models/Address");
const { get } = require("mongoose");

module.exports = {
    addAddress: async (req, res) => {

        const newAddress = new Address({
            userId: req.user.id,
            addressLine1: req.body.addressLine1,
            postalCode: req.body.postalCode,
            default: req.body.default,
            deliveryInstructions: req.body.deliveryInstructions,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        try {
            if(req.body.default === true) {
                await Address.updateMany(
                    { userId: req.user.id },
                    { default: false }
                );
            }

            await newAddress.save();

            res.status(201).json({
                status: true,
                message: "Address has been added successfully"
            });

        } catch (error) {
            res.status(500).json({
                status: false,  
                message: error.message
            });
        }
    },

    getAddresses: async (req, res) => {
        try {
            const addresses = await Address.find({ userId: req.user.id });
            res.status(200).json(addresses);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    deleteAddress: async (req, res) => {
        const addressId = req.params.id;
        try {
            const address = await Address.findById(addressId);

            if (!address) {
                return res.status(404).json({
                    status: false,
                    message: "Address not found"
                });
            }
            await Address.findByIdAndDelete(addressId);

            res.status(200).json({
                status: true,
                message: "Address successfully deleted"
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    setAddressDefault: async (req, res) => {
        const addressId = req.params.id;
        const userId = req.user.id;

        try {
            const address = await Address.findById(addressId);

            if (!address) {
                return res.status(404).json({
                    status: false,
                    message: "Address not found"
                });
            }

            await Address.updateMany(
                { userId: userId },
                { default: false }
            );

            const updatedAddress = await Address.findByIdAndUpdate(
                addressId,
                { default: true }
            );

            if (updatedAddress) {
                await User.findByIdAndUpdate(
                    userId,
                    { address: addressId }
                );

                return res.status(200).json({
                    status: true,
                    message: "Address set as default successfully"
                });
            } else {
                return res.status(500).json({
                    status: false,
                    message: "Failed to set address as default"
                });
            }
            
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    getDefaultAddress: async (req, res) => {
        const userId = req.user.id;

        try {
            const defaultAddress = await Address.findOne({ userId: userId, default: true });
            if (!defaultAddress) {
                return res.status(404).json({
                    status: false,
                    message: "Default address not found"
                });
            }
            res.status(200).json(defaultAddress);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }
};