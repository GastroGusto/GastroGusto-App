const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant.model');
const reviewModel = require('../models/Review.model');
const User = require('../models/User.model');
const ObjectId = require('mongoose').ObjectId;

   

router.get('/restaurants/:id', (req, res, next) => {
    const {id} = req.params;
    Restaurant.findById(id)
    .populate("Review")
    .populate({
        // we are populating author in the previously populated comments
        path: 'Review',
        populate: {
          path: 'username',
          model: 'User'
        }
      })
    .then((restaurantFromDb) => {
        console.log(restaurantFromDb)
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
    reviewModel.create(newReview)
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
//find review by id
router.get("/restaurants/reviews/:reviewid", (req, res, next) => {
    const { reviewid } = req.params;
    reviewModel.findById(reviewid)
        .then((value) => {
            console.log(value);
            res.render('reviews/edit-review', value)
        })

        .catch( e => {
            console.log("error getting restaurant details from DB", e);
            
        });
});

//process form
router.post('/restaurants/reviews/:reviewid', (req, res, next) => {
    const { reviewid } = req.params;
    const { title, comment, rating } = req.body;

    reviewModel.findByIdAndUpdate(reviewid, { title, comment, rating }, { new: true })
        .then( (value) => {
            const idToFind = "" + value._id;
            console.log("here's your value: " + value._id);
            Restaurant.findOne({Review : { $in  : [value._id]}})
            .then((restaurantFound) => {
                console.log("You've made it" + restaurantFound._id);
                res.redirect(`/restaurants/${restaurantFound._id}`);
            })
}) // go to the details page to see the updates
        .catch(error => next(error));
});


// router.post("/restaurants/review/:id", (req, res, next) => {
//         const {id} = req.params;
//         const {title, comment, rating} = req.body;
//         Review.findById(id)
//         .then(review)

// })
//    try {
//     const review = await Review.findById(reviewId);
//     res.render('review/edit-review', review)
//    }
//    catch (e) {
//     next(e)
//    }
// })

module.exports = router