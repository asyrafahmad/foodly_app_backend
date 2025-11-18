const User = require('../models/User');

module.exports = {
    // Controller methods for user operations can be added here if needed in the future

    getUser: async (req, res) => {

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found"
                });
            }

            const { password, __v, otp, createdAt, ...userData } = user._doc;

            res.status(200).json({ status: true, ...userData });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    verifyAccount: async (req, res) => {

        const userOtp = req.params.otp;

        console.log("OTP received:", req.user);
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "User not found"
                });
            }

            if (user.otp !== userOtp) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid OTP"
                });
            }
            
            user.userVerification = true;
            user.otp = null;
            await user.save();

            const {password, __v, otp, createdAt, ...others} = user._doc;
            
            // ...others = spread operator to exclude sensitive fields
            res.status(200).json({...others});
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    verifyPhone: async (req, res) => {
        const phone =  req.params.phone;

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: "User not found"
                });
            }

            user.phoneVerification = true;
            user.phone = phone;
            
            await user.save();

            const {password, __v, otp, createdAt, ...others} = user._doc;
            
            // ...others = spread operator to exclude sensitive fields
            res.status(200).json({...others});
            
           
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    deleteUser: async (req, res) => {

        try {
            await User.findByIdAndDelete(req.user.id);

            return res.status(200).json({
                status: true,
                message: "User successfully deleted"
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
};