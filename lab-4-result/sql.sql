-- 1. Create the database
CREATE DATABASE IF NOT EXISTS vit_result_db;

-- 2. Switch to the database
USE vit_result_db;

-- (Optional) If you want manual table creation instead of letting Hibernate auto-generate them:
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    student_name VARCHAR(100) NOT NULL,
    semester INT NOT NULL
);

CREATE TABLE IF NOT EXISTS results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    mse_marks DOUBLE NOT NULL,
    ese_marks DOUBLE NOT NULL,
    final_marks DOUBLE,
    grade VARCHAR(2),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);