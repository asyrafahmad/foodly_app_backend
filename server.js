const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const AuthRoute = require("./routes/auth");
const UserRoute = require("./routes/user");
const CategoryRoute = require("./routes/category");
const RestaurantRoute = require("./routes/restaurant");
const FoodRoute = require("./routes/food");
const RatingRoute = require("./routes/rating");
const addressRoute = require("./routes/address");
const cartRoute = require("./routes/cart");
// const generateOTP = require('./utils/otp_generator');
// const sendEmail =  require('./utils/smtp_email_function');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Foodly Database Connected"))
        .catch((err) => console.log(err));

// const otp = generateOTP();
// console.log("Generated OTP:", otp);
// sendEmail('are.syraf97@yahoo.com', otp);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/restaurant", RestaurantRoute);
app.use("/api/foods", FoodRoute);
app.use("/api/rating", RatingRoute);
app.use("/api/address", addressRoute);
app.use("/api/cart", cartRoute);



app.listen(process.env.PORT || 6013, () => console.log(`Example App ${process.env.PORT}`))