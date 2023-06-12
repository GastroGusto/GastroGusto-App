const {mongoose, Schema, model } = require("mongoose");


const reviewSchema = new Schema(
    {
        title: String,
        username: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment: String,
        rating: {
            type: Number,
            min: 1,
            max: 5}
    },
    {
        timestamps: true
    }
)

module.exports = model("Review", reviewSchema)