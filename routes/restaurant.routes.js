const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant.model')

router.get('/testrestaurant/', (req, res, next) => {
 
    Restaurant.find({"Location": "Hong Kong"})
    .then((restaurantFromDb) => {
        console.log(restaurantFromDb)
        res.render("restaurants/restaurant-page", restaurantFromDb)
    })
    .catch( e => {
        console.log("error getting restaurant details from DB", e);
        
    });
})

// router.get('/restaurants/:id', (req, res, next) => {
//     const {id} = req.params;
//     Restaurant.findById(id)
//     .then((restaurantFromDb) => {
//         console.log(restaurantFromDb)
//         res.render("restaurants/restaurant-page", restaurantFromDb)
//     })
//     .catch( e => {
//         console.log("error getting restaurant details from DB", e);
        
//     });
// })



module.exports = router