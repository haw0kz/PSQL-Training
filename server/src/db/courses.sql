

CREATE TABLE Courses (
  course_id SERIAL PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  course_description TEXT
);

-- Создание таблицы "Students"
CREATE TABLE Students (
  student_id SERIAL PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL
);

-- Создание таблицы "Teachers"
CREATE TABLE Teachers (
  teacher_id SERIAL PRIMARY KEY,
  teacher_name VARCHAR(255) NOT NULL
);
-- Создание таблицы "StudentCourses" с каскадным удалением и обновлением
CREATE TABLE StudentCourses (
    student_id INT,
    course_id INT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Создание таблицы "TeacherCourses" с каскадным удалением и обновлением
CREATE TABLE TeacherCourses (
    teacher_id INT,
    course_id INT,
    PRIMARY KEY (teacher_id, course_id),
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Grades (
    grade_id SERIAL PRIMARY KEY,
    student_id INT,
    course_id INT,
    grade_value DECIMAL(3, 2) CHECK (grade_value BETWEEN 2.00 AND 5.00),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

