const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant.model');
const reviewModel = require('../models/Review.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const User = require('../models/User.model');
const ObjectId = require('mongoose').ObjectId;

router.get('/restaurants/:id', (req, res, next) => {
	const { id } = req.params;
	Restaurant.findById(id)
		.populate('Review')
		.populate({
			// we are populating author in the previously populated comments
			path: 'Review',
			populate: {
				path: 'username',
				model: 'User',
			},
		})
		.then((restaurantFromDb) => {
			res.render('restaurants/restaurant-page', restaurantFromDb);
		})
		.catch((e) => {
			console.log('error getting restaurant details from DB', e);
		});
});

router.get('/restaurants/:id/review', isLoggedIn, (req, res, next) => {
	const { id } = req.params;
	console.log(req.session);
	Restaurant.findById(id)
		.populate('Review')
		.then((value) => {
			res.render('reviews/review', value);
		})
		.catch((e) => {
			console.log('error getting restaurant details from DB', e);
		});
});

router.post('/restaurants/:id/review', isLoggedIn, (req, res, next) => {
	const { id } = req.params;
	const newReview = {
		title: req.body.title,
		comment: req.body.comment,
		rating: req.body.rating,
		username: req.session.currentUser._id,
	};
	reviewModel
		.create(newReview)
		.then((value) => {
			return Restaurant.findByIdAndUpdate(id, {
				$addToSet: { Review: value._id },
			});
		})
		.then(() => {
			res.redirect(`/restaurants/${id}`);
		})
		.catch((e) => {
			console.log('error getting restaurant details from DB', e);
		});
});
//find review by id
router.get('/restaurants/reviews/:reviewid', isLoggedIn, (req, res, next) => {
	const { reviewid } = req.params;
	reviewModel
		.findById(reviewid)
		.populate('username')
		.then((value) => {
			if (req.session.currentUser.username !== value.username.username) {
				Restaurant.findOne({ Review: { $in: [value._id] } }).then(
					(restaurantFound) => {
						res.redirect(`/restaurants/${restaurantFound._id}`);
					}
				);
			} else {
				res.render('reviews/edit-review', value);
			}
		})
		.catch((e) => {
			console.log('error getting restaurant details from DB', e);
		});
});

//process form
router.post('/restaurants/reviews/:reviewid', isLoggedIn, (req, res, next) => {
	const { reviewid } = req.params;
	const { title, comment, rating } = req.body;
	reviewModel
		.findByIdAndUpdate(reviewid, { title, comment, rating }, { new: true })
		.then((value) => {
			Restaurant.findOne({ Review: { $in: [value._id] } }).then(
				(restaurantFound) => {
					res.redirect(`/restaurants/${restaurantFound._id}`);
				}
			);
		})
		.catch((error) => next(error));
});

router.post(
	'/restaurants/reviews/:reviewid/delete',
	isLoggedIn,
	(req, res, next) => {
		const { reviewid } = req.params;
		reviewModel
			.findById(reviewid)
			.populate('username')
			.then((value) => {
				if (req.session.currentUser.username === value.username.username) {
					reviewModel.findByIdAndDelete(reviewid).then((value) => {
						Restaurant.findOne({ Review: { $in: [value._id] } })
							.then((restaurantFound) => {
								return Restaurant.findByIdAndUpdate(restaurantFound._id, {
									$pull: { Review: reviewid },
								});
							})
							.then((restaurantFound) => {
								res.redirect(`/restaurants/${restaurantFound._id}`);
							});
					});
				} else {
					Restaurant.findOne({ Review: { $in: [value._id] } }).then(
						(restaurantFound) => {
							res.redirect(`/restaurants/${restaurantFound._id}`);
						}
					);
				}
			})
			.catch((e) => {
				console.log('error getting restaurant details from DB', e);
			});
	}
);

router.get('/restaurants/tag/:type/:resttag', (req, res, next) => {
	const { resttag, type } = req.params;
	const filterType = type.charAt(0).toUpperCase() + type.slice(1);
	const filterTag = resttag.charAt(0).toUpperCase() + resttag.slice(1);

	Restaurant.find({ [filterType]: filterTag })
		.then((restaurantsFromDb) => {
			res.render('restaurants/tag', { data: restaurantsFromDb });
		})
		.catch((e) => {
			console.log('error getting restaurant details from DB', e);
		});
});

router.get('/restaurants/filter/:type/', (req, res, next) => {
	const { type } = req.params;
	const filterType = type.charAt(0).toUpperCase() + type.slice(1);

	Restaurant.find()
		.distinct(filterType)
		.then((restaurantsFromDb) => {
			const restaurantObj = Object.fromEntries(
				restaurantsFromDb.map((key) => [key, 0])
			);
			console.log(restaurantObj);
			res.render('restaurants/unique-filter', restaurantObj);
		})
		.catch((e) => {
			console.log('error getting restaurant details from DB', e);
		});
});

router.get('/search', (req, res) => {
	res.render('restaurants/search');
});

router.post('/search', (req, res) => {
	const { search } = req.body;
	const searchParam = new RegExp(search, 'i');
	console.log(search);
	Restaurant.find({ Name: { $regex: searchParam } })
		.then((restaurantsFromDb) => {
			console.log(restaurantsFromDb);
			res.render('restaurants/search', restaurantsFromDb);
		})
		.catch((e) => {
			console.log('error getting restaurant details from DB', e);
		});
});

module.exports = router;
