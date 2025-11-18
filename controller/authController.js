const User = require("../models/User");
const CryptToJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const generateOTP = require('../utils/otp_generator');
const sendEmail =  require('../utils/smtp_email_function');

module.exports = {
    
    createUser: async (req, res) => {
        // Implementation for creating a user

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if(!emailRegex.test(req.body.email)) {
            return res.status(400).json({
                status: false,
                message: "Invalid email format"
            });
        }

        const minPasswordLength = 8;

        if(req.body.password.length < minPasswordLength) {
            return res.status(400).json({
                status: false,
                message: `Password must be at least ${minPasswordLength} characters long`
            });
        }

        try {
            const emailExists = await User.findOne({ email: req.body.email });
            if(emailExists) {
                return res.status(400).json({
                    status: false,
                    message: "Email already in use"
                });
            }

            // GENERATE OTP
            const otp = generateOTP();

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                userType: 'Client',
                password: CryptToJS.AES.encrypt(
                    req.body.password,
                    process.env.PASSWORD_SECRET_KEY
                ).toString(),
                otp: otp
            });

            // SAVE USER TO DB
            await newUser.save();

            // SEND OTP TO EMAIL
            sendEmail(newUser.email, otp);

            res.status(201).json({
                status: true,
                message: "User created successfully. Please verify your email with the OTP sent."
            });

        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }


    },

    loginUser: async (req, res) => {
        // Implementation for user login

         const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if(!emailRegex.test(req.body.email)) {
            return res.status(400).json({
                status: false,
                message: "Invalid email format"
            });
        }

        const minPasswordLength = 8;

        if(req.body.password.length < minPasswordLength) {
            return res.status(400).json({
                status: false,
                message: `Password must be at least ${minPasswordLength} characters long`
            });
        }

        try {
            const user = await User.findOne({ email: req.body.email });

            if(!user) {
                return res.status(401).json({
                    status: false,
                    message: "User/Email not found"
                });
            }

            const decryptedPassword = CryptToJS.AES.decrypt(
                user.password,
                process.env.PASSWORD_SECRET_KEY
            ).toString(CryptToJS.enc.Utf8);

            if(decryptedPassword !== req.body.password) {
                return res.status(401).json({
                    status: false,
                    message: "Invalid password"
                });
            }
            const userToken = jwt.sign(
                { id: user._id, userType: user.userType, email: user.email },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '7d' }
            );

            const {password, createdAt, updatedAt, __v , otp, ...others} = user._doc;

            res.status(200).json({
                ...others,
                userToken: userToken,
                status: true,
                message: "Login successful"
            });
            
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }

    }
}