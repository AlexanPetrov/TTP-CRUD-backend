CREATE DATABASE school;

CREATE TABLE student (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    campus_id INT,
    FOREIGN KEY (campus_id) REFERENCES campus(campus_id)
);

CREATE TABLE campus (
    campus_id SERIAL PRIMARY KEY,
    campusName VARCHAR(250)
);
