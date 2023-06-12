const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant.model')
const Review = require('../models/Review.model')


   

router.get('/restaurants/:id', (req, res, next) => {
    const {id} = req.params;
    Restaurant.findById(id)
    .populate("Review")
    .then((restaurantFromDb) => {
        console.log(restaurantFromDb);
        res.render("restaurants/restaurant-page", restaurantFromDb)
    })
    .catch( e => {
        console.log("error getting restaurant details from DB", e);
        
    });
})


router.get('/restaurants/:id/review', (req, res, next) => {
    const {id} = req.params;
    console.log(req.session)
    Restaurant.findById(id)
        .populate("Review")
        .then((value) => {
            res.render('restaurants/review', value)

        })
        .catch( e => {
            console.log("error getting restaurant details from DB", e);
            
        });
    
})

router.post('/restaurants/:id/review', (req, res, next) => {
    const {id} = req.params;
    const newReview = {
        title: req.body.title,
        comment: req.body.comment,
        rating: req.body.rating,
        username: req.session.currentUser._id
    }
    Review.create(newReview)
        .then((value) => {
            return Restaurant.findByIdAndUpdate(id, {$addToSet: {Review: value._id}})
        })
        .then(() => {
            res.redirect(`/restaurants/${id}`)
        })
        .catch( e => {
            console.log("error getting restaurant details from DB", e);
            
        });

})
module.exports = router