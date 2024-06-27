
INSERT INTO department (name) VALUES 
('Customer Experience'),
('Bakery'),
('Meat Department'),
('Fresh Food'),
('Leadership');


INSERT INTO role (title, salary, department_id) VALUES 
('Clerk', 30000, 1), 
('Baker', 32000, 2), 
('Deli Butcher', 40000, 3), 
('Stocker', 30000, 4), 
('Supervisor', 60000, 5),
('Lead Supervisor', 65000, 5), 
('General Manager', 85000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Scott', 'Michael', 7, NULL),  -- Highest-level Supervisor, other supervisors report to Scott
('Sam', 'Barker', 6, 1),
('Sal', 'Merrin', 5, 1),
('Gary', 'Johnson', 5, 1),
('June', 'Haverford', 2, 3),
('Eric', 'Shannon', 3, 3),
('Gerald', 'White', 1, 4),
('Brian', 'Grouper', 4, 3),
('Maurice', 'Bridgerton', 4, 3);
