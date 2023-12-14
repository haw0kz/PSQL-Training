import psycopg2
import random
import faker

# Подключение к базе данных
conn = psycopg2.connect(
    database="Education",
    user="postgres",
    password="12345",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()
cursor.execute("TRUNCATE TABLE courses CASCADE ")
cursor.execute("TRUNCATE TABLE students CASCADE")
cursor.execute("TRUNCATE TABLE teachers CASCADE")

# Генерация данных с использованием библиотеки Faker
fake = faker.Faker()

# Генерация курсов
for i in range(101):
    course_name = fake.word()
    course_description = fake.sentence()
    cursor.execute("INSERT INTO Courses (course_id, course_name, course_description) VALUES (%s, %s, %s);", (i, course_name, course_description))

# Генерация студентов
for i in range(201):
    student_name = fake.name()
    cursor.execute("INSERT INTO Students (student_id, student_name) VALUES (%s, %s);", (i, student_name,))

# Генерация преподавателей
for i in range(51):
    teacher_name = fake.name()
    cursor.execute("INSERT INTO Teachers (teacher_id, teacher_name) VALUES (%s, %s);", (i, teacher_name,))

# Сохранение изменений и закрытие соединения
conn.commit()

# Генерация связей студентов с курсами
student_course_set = set()
for i in range(301):
    student_id = random.randint(1, 200)
    course_id = random.randint(1, 100)
    student_course_pair = (student_id, course_id)

    # Проверка на уникальность комбинации student_id и course_id
    if student_course_pair not in student_course_set:
        cursor.execute("INSERT INTO StudentCourses (student_id, course_id) VALUES (%s, %s);", student_course_pair)
        student_course_set.add(student_course_pair)

# Сохранение изменений и закрытие соединения
conn.commit()
cursor.close()
conn.close()