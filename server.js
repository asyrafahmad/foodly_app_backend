const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Foodly Database Connected"))
        .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('Hello World'))
app.listen(process.env.PORT || 6013, () => console.log(`Example App ${process.env.PORT}`))