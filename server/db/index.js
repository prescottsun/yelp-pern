const { Pool } = require("pg");

const pool = new Pool();
//   {
// 	user: "prescott",
// 	host: "localhost",
// 	database: "yelp",
// 	password: "password",
// 	port: 5432,
// }
module.exports = {
	query: (text, params) => pool.query(text, params),
};
