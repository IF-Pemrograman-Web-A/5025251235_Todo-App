CREATE DATABASE IF NOT EXISTS todo_e04;
USE todo_e04;

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('todo', 'progress', 'done') NOT NULL DEFAULT 'todo',
    scope ENUM('personal', 'shared') NOT NULL DEFAULT 'personal',
    owner_key VARCHAR(128) NOT NULL,
    image_path VARCHAR(255) DEFAULT NULL,
    notification_time DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO todos
    (title, description, status, scope, owner_key)
VALUES
    ('Learn HTML', 'Practice semantic HTML elements', 'todo', 'shared', 'team'),
    ('Learn CSS', 'Practice Flexbox and Grid', 'todo', 'shared', 'team'),,
    ('Team Meeting', 'Discuss the project progress', 'progress', 'shared', 'team'),
    ('Finish Assignment', 'Complete the web programming task', 'todo', 'shared', 'team');
