const { Schema, model } = require("mongoose");

const gastroSchema = new Schema(
    {
        name: String,
        address: String,
        location: String,
        price: String,
        cuisine: String,
        longitude: String,
        latitude: String,
        phoneNumber: String,
        url: String, 
        websiteUrl: String,
        award: String,
        facilitiesAndServices: String,

    }
)
module.exports = model('Restaurant', gastroSchema)