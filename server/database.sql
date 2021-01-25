CREATE DATABASE school;

CREATE TABLE student (
    student_id INT PRIMARY KEY,
    name VARCHAR(255),
    campus_id INT,
    FOREIGN KEY (campus_id) REFERENCES campus(campus_id),
    gpa FLOAT,
    studenturl VARCHAR(1000)
);

CREATE TABLE campus (
    campus_id INT PRIMARY KEY,
    campusname VARCHAR(1000),
    campuslocation VARCHAR(1000),
    campusimageurl VARCHAR(1000),
    campusdescription VARCHAR(1000),
    total INT
);
