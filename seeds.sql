INSERT INTO department (name) VALUES ('Customer Experience'), ('Bakery'), ('Meat Department'), ('Fresh Food'), ('Leadership');

INSERT INTO role (title, salary, department_id) VALUES ('Clerk', 50000, 1), ('Baker', 55000, 2), ('Deli Butcher', 60000, 3), ('Stocker', 45000, 4), ('Supervisor', 120000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Sam', 'Barker', 5, 7),
('June', 'Haverford', 2, 6),
('Eric', 'Shannon', 3, 6),
('Brian', 'Grouper', 4, 1),
('Sal', 'Merrin', 5, 7),
('Gary', 'Johnson', 5, 7),
('Scott', 'Michael', 5, NULL), --Highest-level Supervisor other supervisors report to Wayne
('Gerald', 'White', 1, 5),
('Maurice', 'Bridgerton', 4, 1); 