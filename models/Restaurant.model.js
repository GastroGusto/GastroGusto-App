const { mongoose, Schema, model } = require("mongoose");


const gastroSchema = new Schema(
    {
        Name: String,
        Address: String,
        Location: String,
        Price: String,
        Cuisine: String,
        Longitude: String,
        Latitude: String,
        PhoneNumber: String,
        Url: String, 
        WebsiteUrl: String,
        Award: String,
        FacilitiesAndServices: String,
        Review: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }]
    }
)
module.exports = model('Restaurant', gastroSchema)