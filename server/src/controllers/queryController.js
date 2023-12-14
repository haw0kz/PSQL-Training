// queryController.js
const pool = require('../db/index');
const path = require('path')
const { faker } = require('@faker-js/faker');

const executeQuery = async (req, res) => {
    const { query } = req.body;
    try {
        const result = await pool.query(query);
        res.status(200).json(result);
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message);
    }
};
const getTables = async (req, res) => {
    try {
        const tablesQuery = 'SELECT table_name FROM information_schema.tables WHERE table_schema = $1';
        const tables = await pool.any(tablesQuery, ['public']);
        res.status(200).json(tables);
    } catch (error) {
        console.error('Ошибка получения списка таблиц:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getTableByName = async (req, res) => {
    const tableName = req.params.table;
    try {
        const tableQuery = `SELECT * FROM ${tableName}`;
        const tableData = await pool.any(tableQuery);
        res.status(200).json(tableData);
    } catch (error) {
        console.error(`Ошибка получения данных из таблицы ${tableName}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const fillAllTables = async (req, res) => {
    const client = await pool.connect();
    try {

        // Удаление данных из таблиц
        await client.query('TRUNCATE TABLE courses CASCADE');
        await client.query('TRUNCATE TABLE students CASCADE');
        await client.query('TRUNCATE TABLE teachers CASCADE');
        await client.query('TRUNCATE TABLE studentcourses CASCADE');

        // Генерация фейковых данных и вставка их в таблицу "courses"
        for (let i = 1; i <= 100; i++) {
            const courseName = faker.lorem.word() ;
            const courseDescription = faker.lorem.sentence();
            await client.query('INSERT INTO courses (course_id, course_name, course_description) VALUES ($1, $2, $3);', [i, courseName, courseDescription]);
        }

        // Генерация фейковых данных и вставка их в таблицу "students"
        for (let i = 1; i <= 200; i++) {
            const studentName = faker.person.firstName() +' '+  faker.person.lastName() ;
            await client.query('INSERT INTO students (student_id, student_name) VALUES ($1, $2);', [i, studentName]);
        }

        // Генерация фейковых данных и вставка их в таблицу "teachers"
        for (let i = 1; i <= 50; i++) {
            const teacherName = faker.person.firstName() +' '+ faker.person.lastName() ;
            await client.query('INSERT INTO teachers (teacher_id, teacher_name) VALUES ($1, $2);', [i, teacherName]);
        }

        // Генерация связей студентов с курсами
        const studentCourseSet = new Set();
        for (let i = 1; i <= 300; i++) {
            const studentId = faker.number.int({ min: 1, max: 200 });
            const courseId = faker.number.int({ min: 1, max: 100 });
            const studentCoursePair = `${studentId}-${courseId}`;

            // Проверка на уникальность комбинации studentId и courseId
            if (!studentCourseSet.has(studentCoursePair)) {
                await client.query('INSERT INTO studentcourses (student_id, course_id) VALUES ($1, $2);', [studentId, courseId]);
                studentCourseSet.add(studentCoursePair);
            }
        }
        const teacherCourseSet = new Set();
        for (let i = 1; i <= 300; i++) {
            const teacherId = faker.number.int({ min: 1, max: 50 });
            const courseId = faker.number.int({ min: 1, max: 100 });
            const teacherCoursePair = `${teacherId}-${courseId}`;

            // Проверка на уникальность комбинации studentId и courseId
            if (!teacherCourseSet.has(teacherCoursePair)) {
                await client.query('INSERT INTO teachercourses (teacher_id, course_id) VALUES ($1, $2);', [teacherId, courseId]);
                teacherCourseSet.add(teacherCoursePair);
            }
        }
        for (let i = 1; i <= 300; i++) {
            const studentId = faker.number.int({ min: 1, max: 200 });
            const courseId = faker.number.int({ min: 1, max: 100 });
            const gradeValue = faker.number.int({ min: 2, max: 5, precision: 0.01 });

            await client.query('INSERT INTO grades (student_id, course_id, grade_value) VALUES ($1, $2, $3);', [studentId, courseId, gradeValue]);
        }

        res.status(200).json({ message: 'Все таблицы успешно заполнены дефолтными значениями' });
    } catch (error) {
        console.error('Ошибка заполнения всех таблиц:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        client.done()
    }
};


module.exports = {
    executeQuery,
    getTables,
    getTableByName,
    fillAllTables
};