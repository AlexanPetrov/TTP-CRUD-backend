const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { response } = require("express");

// loading middleware
app.use(cors());
app.use(express.json({ type: "*/*" }));

// ROUTES

// create a student
app.post("/student", async (request, response, next) => {
	try {
		const { name, campusname, gpa, studenturl } = request.body;

		if (campusname === "" && gpa === "") {
			const currentStudent = await pool.query(
				"INSERT INTO student (name, studenturl) VALUES ($1,$2)",
				[name, studenturl]
			);

			const singleStudent = await pool.query(
				"SELECT * FROM student WHERE name = $1",
				[name]
			);
			response.send(singleStudent);
		} else if (gpa === "") {
			const currentStudent = await pool.query(
				"INSERT INTO student (name, gpa, studenturl) VALUES ($1,$2,$3)",
				[name, gpa, studenturl]
			);

			const singleStudent = await pool.query(
				"SELECT * FROM student WHERE name = $1",
				[name]
			);
			response.send(singleStudent);
		} else if (campusname === "") {
			const currentStudent = await pool.query(
				"INSERT INTO student (name, gpa, studenturl) VALUES ($1,$2,$3)",
				[name, gpa, studenturl]
			);

			const singleStudent = await pool.query(
				"SELECT * FROM student WHERE name = $1",
				[name]
			);
			response.send(singleStudent);
		}
	} catch (err) {
		console.error(err.message);
	}
});

// create a campus
app.post("/campus", async (request, response, next) => {
	try {
		const {
			campusname,
			campuslocation,
			campusimageurl,
			campusdescription,
		} = request.body;

		const newCampus = await pool.query(
			"INSERT INTO campus (campusname, campuslocation, campusimageurl, campusdescription, total) VALUES ($1,$2,$3,$4, $5)",
			[campusname, campuslocation, campusimageurl, campusdescription, 0]
		);
		const singleCampus = await pool.query(
			"SELECT * FROM campus WHERE campusname = $1",
			[campusname]
		);
		response.send(singleCampus);
	} catch (err) {
		console.error(err.message);
	}
});

app.get("/campus/:campusname", async (request, response, next) => {
	try {
		const { campusname } = request.params;
		const singleCampus = await pool.query(
			"SELECT * FROM campus WHERE campusname = $1",
			[campusname]
		);
		response.send(singleCampus);
	} catch (err) {
		console.error(err.message);
	}
});

// get all students
app.get("/school", async (request, response, next) => {
	try {
		const allStudents = await pool.query("SELECT * FROM student");
		response.json(allStudents.rows);
	} catch (err) {
		console.error(err.message);
	}
});

// get all campuses
app.get("/campus", async (request, response, next) => {
	try {
		const allCampuses = await pool.query("SELECT * FROM campus");
		response.json(allCampuses.rows);
	} catch (err) {
		console.error(err.message);
	}
});

app.get("/noCampusStudent", async (request, response, next) => {
	try {
		const allCampuses = await pool.query(
			"SELECT * FROM student WHERE campus_id IS NULL"
		);
		console.log(allCampuses);
		response.json(allCampuses.rows);
	} catch (error) {
		console.error(error.message);
	}
});

// update a student
app.put("/school/:id", async (request, response, next) => {
	try {
		const { id } = request.params;
		const { name, campusname, campus_id, gpa, studenturl } = request.body;
		console.log("here");
		//Enroll student
		if (campus_id) {
			await pool.query(
				"UPDATE student SET campus_id = $1 WHERE student_id = $2",
				[campus_id, parseInt(id)]
			);

			const getStudent = await pool.query(
				"SELECT * FROM student WHERE student_id = $1",
				[parseInt(id)]
			);

			const findCampusID = await pool.query(
				"SELECT * FROM campus WHERE campus_id= $1",
				[campus_id]
			);

			let total = findCampusID.rows[0].total;

			const updateCampus = await pool.query(
				"UPDATE campus SET total = $1 WHERE campus_id = $2",
				[++total, campus_id]
			);

			response.send(getStudent);

			//Update student's information
		} else if (campus_id == null) {
			const findCampusByName = await pool.query(
				"SELECT * FROM campus WHERE campusname = $1",
				[campusname]
			);

			let campusID = findCampusByName.rows[0].campus_id;

			const updateStudent = await pool.query(
				"UPDATE student SET name = $1, campus_id = $2, gpa = $3, studenturl = $4 WHERE student_id = $5",
				[name, campusID, gpa, studenturl, parseInt(id)]
			);

			const getStudent = await pool.query(
				"SELECT * FROM student WHERE student_id = $1",
				[parseInt(id)]
			);

			response.send(getStudent);
		}
	} catch (err) {
		console.error(err.message);
	}
});

// update a campus
app.put("/school/campus/:id", async (request, response, next) => {
	try {
		const { id } = request.params;
		const {
			campusname,
			campuslocation,
			campusimageurl,
			campusdescription,
		} = request.body;
		const updateCampus = await pool.query(
			"UPDATE campus SET campusName = $1, campuslocation = $2, campusimageurl=$3, campusdescription = $4 WHERE campus_id = $5",
			[campusname, campuslocation, campusimageurl, campusdescription, id]
		);
		response.json("Updated");
	} catch (err) {
		console.error(err.message);
	}
});

// delete a student
app.delete("/school/:id", async (request, response, next) => {
	try {
		const { id } = request.params;

		const getStudentRow = await pool.query(
			"SELECT * FROM student WHERE student_id = $1",
			[id]
		);

		let campus_id = getStudentRow.rows[0].campus_id;

		if (campus_id == null) {
			const deleteStudent = await pool.query(
				"DELETE FROM student WHERE student_id = $1",
				[id]
			);
		} else {
			const getCampusRow = await pool.query(
				"SELECT * FROM campus WHERE campus_id = $1",
				[campus_id]
			);
			let total = getCampusRow.rows[0].total;

			await pool.query("UPDATE campus SET	total = $1 WHERE campus_id = $2  ", [
				--total,
				campus_id,
			]);

			const deleteStudent = await pool.query(
				"DELETE FROM student WHERE student_id = $1",
				[id]
			);
		}

		response.json("Deleted");
	} catch (err) {
		console.error(err.message);
	}
});

// delete a campus
app.delete("/school/campus/:id", async (request, response, next) => {
	try {
		const { id } = request.params;

		const getCampusRow = await pool.query(
			"SELECT * FROM campus WHERE campus_id = $1",
			[id]
		);

		let total = getCampusRow.rows[0].total;

		if (total > 0) {
			response.json("There are still students");
		} else {
			const deleteCampus = await pool.query(
				"DELETE FROM campus WHERE campus_id = $1",
				[id]
			);
		}
	} catch (err) {
		console.error(err.message);
	}
});

// listener
app.listen(5000, () => {
	console.log("Server has started on port 5000");
});
