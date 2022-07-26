USE employeesDB;
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Chris", "Law", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Josh", "Feel", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Terence", "Bud", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Linda", "Sales", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("tina", "chain", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Floyd", "Rich", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jay", "Greenman", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bear", "Oak", 1, 2);


SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id GROUP BY d.id, d.name