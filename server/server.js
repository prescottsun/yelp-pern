require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./db");

const app = express();

// app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
	try {
		// const results = await db.query("select * from restaurants");
		const restaurantRatingsData = await db.query(
			"select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id; "
		);

		// console.log("results:", results);
		// console.log("restaurant data:", restaurantRatingsData);

		res.status(200).json({
			status: "success",
			results: restaurantRatingsData.rows.length,
			data: {
				restaurants: restaurantRatingsData.rows,
			},
		});
	} catch (err) {
		console.log(err);
	}
});

// Get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
	// console.log(req.params.id);

	try {
		const restaurant = await db.query(
			"select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
			[req.params.id]
		);

		const reviews = await db.query(
			"select * from reviews where restaurant_id = $1",
			[req.params.id]
		);

		res.status(200).json({
			status: "success",
			data: {
				restaurant: restaurant.rows[0],
				reviews: reviews.rows,
			},
		});
	} catch (err) {
		console.log(err);
	}
});

// Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
	console.log(req.body);

	try {
		const results = await db.query(
			"insert into restaurants (name, location, price_range) values ($1, $2, $3) returning *",
			[req.body.name, req.body.location, req.body.price_range]
		);
		res.status(201).json({
			status: "success",
			data: {
				restaurant: results.rows[0],
			},
		});
	} catch (err) {
		console.log(err);
	}
});

// Update a restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
	try {
		const results = await db.query(
			"update restaurants set name = $1, location = $2, price_range = $3 where id = $4 returning *",
			[req.body.name, req.body.location, req.body.price_range, req.params.id]
		);

		res.status(200).json({
			status: "success",
			data: {
				restaurant: results.rows[0],
			},
		});
	} catch (err) {
		console.log(err);
	}

	// console.log(req.params.id);
	// console.log(req.body);
});

// Delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
	try {
		const results = db.query("delete from restaurants where id = $1", [
			req.params.id,
		]);
		res.status(204).json({
			status: "success",
		});
	} catch (err) {
		console.log(err);
	}
});

// Add a review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
	try {
		const newReview = await db.query(
			`insert into reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;`,
			[req.params.id, req.body.name, req.body.review, req.body.rating]
		);
		res.status(201).json({
			status: "success",
			data: {
				review: newReview.rows[0],
			},
		});
	} catch (err) {
		console.log(err);
	}
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
