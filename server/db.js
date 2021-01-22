const Pool = require("pg").Pool;

const pool = new Pool({
	user: "postgres",
	password: "Imthebest1!",
	host: "localhost",
	port: 5432,
	database: "school",
});

module.exports = pool;
