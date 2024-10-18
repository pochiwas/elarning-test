SELECT 
  users.id AS user_id,
  users.name AS user_name,
  users.email AS user_email,
  users.role AS user_role,
  courses.id AS course_id,
  courses.name AS course_name,
  courses.description AS course_description
FROM 
  users
LEFT JOIN 
  user_courses ON users.id = user_courses.userId
LEFT JOIN 
  courses ON user_courses.courseId = courses.id
ORDER BY 
  users.id, courses.id;


INSERT INTO users (name, email, password, role, createdAt, updatedAt)
VALUES ('Nuevo Usuario', 'nuevo_usuario@example.com', 'password_encriptado', 'alumno', NOW(), NOW());


INSERT INTO courses (name, description, createdAt, updatedAt)
VALUES ('Curso de JavaScript', 'Curso introductorio de JavaScript', NOW(), NOW());

INSERT INTO user_courses (userId, courseId)
VALUES (1, 1);  -- Reemplaza los IDs según corresponda
