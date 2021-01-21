const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// loading middleware
app.use(cors());
app.use(express.json({ type: "*/*" }));

// ROUTES

// create a student
app.post("/school", async (request, response, next) => {
    try {
        const { name, campus_id, gpa, studenturl } = request.body;
        const newStudent = await pool.query("INSERT INTO student (name, campus_id, gpa, studenturl) VALUES ($1,$2,$3,$4)", 
        [name, campus_id, gpa, studenturl]);
        response.json(newStudent);
    }   
    catch (err) {
        console.error(err.message);
    }   
});

// create a campus
app.post("/school/campus", async (request, response, next) => {
    try {
        const { campusName, campuslocation, campusimageurl, campusdescription } = request.body;
        const newCampus = await pool.query("INSERT INTO campus (campusName, campuslocation, campusimageurl, campusdescription) VALUES ($1,$2,$3,$4)", 
        [campusName, campuslocation, campusimageurl, campusdescription]);
        response.json(newCampus);
    }   
    catch (err) {
        console.error(err.message);
    }   
});

// get all students
app.get("/school", async (request, response, next) => {
    try {
        const allStudents = await pool.query("SELECT * FROM student");
        response.json(allStudents.rows);
    }   
    catch (err) {
        console.error(err.message);
    }   
});

// get all campuses
app.get("/school/campus", async (request, response, next) => {
    try {
        const allCampuses = await pool.query("SELECT * FROM campus");
        response.json(allCampuses.rows);
    }   
    catch (err) {
        console.error(err.message);
    }   
});

// get a student
app.get("/school/:id", async (request, response, next) => {
    try {
        const { id } = request.params;
        const singleStudent = await pool.query("SELECT * FROM student WHERE student_id = $1", [id]);
        response.json(singleStudent.rows[0]);
    }   
    catch (err) {
        console.error(err.message);
    }   
});

// get a campus
app.get("/school/campus/:id", async (request, response, next) => {
    try {
        const { id } = request.params;
        const singleCampus = await pool.query("SELECT * FROM campus WHERE campus_id = $1", [id]);
        response.json(singleCampus.rows[0]);
    }   
    catch (err) {
        console.error(err.message);
    }   
});

// update a student
app.put("/school/:id", async (request, response, next) => {
    try {
        const { id } = request.params;
        const { name, campus_id, gpa, studenturl } = request.body;
        const updateStudent = await pool.query("UPDATE student SET name = $1, campus_id = $2, gpa = $3, studenturl = $4 WHERE student_id = $5",
                                            [name, campus_id, gpa, studenturl, id]);
        response.json("Updated");
    }
    catch (err) {
        console.error(err.message);
    }
});

// update a campus
app.put("/school/campus/:id", async (request, response, next) => {
    try {
        const { id } = request.params;
        const { campusName, campuslocation, campusimageurl, campusdescription } = request.body;
        const updateCampus = await pool.query("UPDATE campus SET campusName = $1, campuslocation = $2, campusimageurl=$3, campusdescription = $4 WHERE campus_id = $5",
                                            [campusName, campuslocation, campusimageurl, campusdescription, id]);
        response.json("Updated");
    }
    catch (err) {
        console.error(err.message);
    }
});

// delete a student
app.delete("/school/:id", async (request, response, next) => {
    try {
        const { id } = request.params;
        const deleteStudent = await pool.query("DELETE FROM student WHERE student_id = $1",
                                            [id]);
        response.json("Deleted");
    }
    catch (err) {
        console.error(err.message);
    }
});

// delete a campus
app.delete("/school/campus/:id", async (request, response, next) => {
    try {
        const { id } = request.params;
        const deleteCampus = await pool.query("DELETE FROM campus WHERE campus_id = $1",
                                            [id]);
        response.json("Deleted");
    }
    catch (err) {
        console.error(err.message);
    }
});

// listener
app.listen(5000, () => {
    console.log("Server has started on port 5000")
})

