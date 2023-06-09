// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

const capitalize = require('./utils/capitalize');
const projectName = 'GastroGusto';

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const restaurantRoutes = require('./routes/restaurant.routes');
const RestaurantModel = require('./models/Restaurant.model');
app.use('/', restaurantRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

hbs.registerHelper('starsystem', function (text) {
	console.log(text);
	if (text.fn(this).includes('Bib Gourmand')) {
		return new hbs.SafeString('<img src="../../../images/range-slider/1.png">');
	} else if (text.fn(this).includes('1 MICHELIN Star')) {
		return new hbs.SafeString('<img src="../../../images/range-slider/2.png">');
	} else if (text.fn(this).includes('2 MICHELIN Stars')) {
		return new hbs.SafeString('<img src="../../../images/range-slider/3.png">');
	} else if (text.fn(this).includes('3 MICHELIN Stars')) {
		return new hbs.SafeString('<img src="../../../images/range-slider/4.png">');
	}
});

hbs.registerHelper('compare', function (lvalue, operator, rvalue, options) {
	var operators, result;
	console.log(`${lvalue} and ${rvalue}`);
	if (arguments.length < 3) {
		throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
	}

	if (options === undefined) {
		options = rvalue;
		rvalue = operator;
		operator = '===';
	}

	operators = {
		'==': function (l, r) {
			return l == r;
		},
		'===': function (l, r) {
			return l === r;
		},
		'!=': function (l, r) {
			return l != r;
		},
		'!==': function (l, r) {
			return l !== r;
		},
		'<': function (l, r) {
			return l < r;
		},
		'>': function (l, r) {
			return l > r;
		},
		'<=': function (l, r) {
			return l <= r;
		},
		'>=': function (l, r) {
			return l >= r;
		},
		typeof: function (l, r) {
			return typeof l == r;
		},
	};

	if (!operators[operator]) {
		throw new Error(
			"Handlerbars Helper 'compare' doesn't know the operator " + operator
		);
	}

	result = operators[operator](lvalue, rvalue);

	if (result) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

module.exports = app;
