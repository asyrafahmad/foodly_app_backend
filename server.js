const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const CategoryRoute = require("./routes/category");
const RestaurantRoute = require("./routes/restaurant");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Foodly Database Connected"))
        .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api/category", CategoryRoute);
app.use("/api/restaurant", RestaurantRoute);


app.listen(process.env.PORT || 6013, () => console.log(`Example App ${process.env.PORT}`))