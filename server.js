const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesDB'
        //dependencies
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function optionStart() { ////STARTING PROMPT



    inquirer.prompt([{
            type: 'list',
            message: 'What would you like to view?',
            name: 'nextOption',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Departments', 'Add Department', 'View All Roles', 'Add Role']
                //list of options
        }])
        .then(
            function(data) {
                if (data.nextOption === 'View All Employees') {
                    allEmployees()
                } else if (data.nextOption === 'Add Employee') {
                    newPerson()

                } else if (data.nextOption === 'Update Employee Role') {
                    updateEm();
                } else if (data.nextOption === 'View All Departments') {
                    viewAllDept()

                } else if (data.nextOption === 'Add Department') {
                    addDept()

                } else if (data.nextOption === 'View All Roles') {
                    viewAllRoles()

                } else if (data.nextOption === 'Add Role') {
                    newRole()

                }
            }
        )
        // calling function for each select
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function allEmployees() { ////VIEW ALL EMPLOYEES

    const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`; //calling sql to display right information

    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.table(rows)
        optionStart()
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function viewAllDept() { ////VIEW ALLL DEPARTMENTS

    const sql = `SELECT * FROM department `;

    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.table(rows)
        optionStart()
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function viewAllRoles() { /////VIEW ALL ROLES

    const sql =
        `SELECT r.id, r.title, r.salary, d.name AS department
        FROM role r
        LEFT JOIN department d
        ON d.id = r.department_id
        `;
    //calling sql to display right information

    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.table(rows) // console.table which shows the table
        optionStart()
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateEm() {
    employeeUpdate(); ////UPDATE EMPLOYEEE ROLE

}

function employeeUpdate() {
    const sql =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e JOIN role r ON e.role_id = r.id JOIN department d
    ON d.id = r.department_id JOIN employee m ON m.id = e.manager_id` //calling sql to display right information
    db.query(sql, function(err, res) {
        if (err) throw err;
        const newRoleEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${first_name} ${last_name}`
        }));
        console.table(res);
        roleUpdate(newRoleEmployeeChoices);
    });
}

function roleUpdate(newRoleEmployeeChoices) {
    const sql =
        `SELECT r.id, r.title, r.salary
    FROM role r`
    let roleUpdateTo;
    db.query(sql, function(err, res) {
        if (err) throw err;
        roleUpdateTo = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));
        console.table(res);
        promoteEmployeeRole(newRoleEmployeeChoices, roleUpdateTo);
    });
}

function promoteEmployeeRole(newRoleEmployeeChoices, roleUpdateTo) {

    inquirer
        .prompt([{
                type: "list",
                name: "employee_id",
                message: "Who will be promoted?",
                choices: newRoleEmployeeChoices
            },
            {
                type: "list",
                name: "role_id",
                message: "Choose promotion id",
                choices: roleUpdateTo
            },
        ])
        .then(function(answer) {
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
            db.query(sql, [answer.role_id,
                    answer.employee_id
                ],
                function(err, res) {
                    if (err) throw err;
                    console.table(res);
                    console.log(res.affectedRows + " promotion success");
                    optionStart();
                });
        });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function addDept() { /////// ADD A DEPARTMENT

    const sql =
        `SELECT * FROM department `;

    db.query(sql, function(err, res) {
        if (err) throw err;

        const newDept = res.map(({ id, name }) => ({
            value: id,
            name: `${name}`,
        }));

        console.table(res);

        insertDept(newDept);
    });
}

function insertDept(newDept) {

    inquirer.prompt([{
            type: "input",
            name: "name",
            message: "Add the new Department",
            choices: newDept
        }, ])
        .then(function(answer) {
            const sql = `INSERT INTO department SET ?`
            db.query(sql, {
                    name: answer.name
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(" WOW! New department added ");

                    optionStart();
                });
        });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function newRole() { /////// ADD ROLE

    const sql =
        `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id GROUP BY d.id, d.name`;

    db.query(sql, function(err, res) {
        if (err) throw err;

        const whatDept = res.map(({ id, name }) => ({

            value: id,
            name: `${id} ${name}`
        }));

        insertRole(whatDept);
    });
}

function insertRole(whatDept) {
    inquirer.prompt([{
                type: "input",
                name: "title",
                message: "What is the new role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the new role?",
            },
            {
                type: "list",
                name: "dept_id",
                message: "What department does the new role belong to?",
                choices: whatDept
            },
        ])
        .then(function(answer) {
            const sql = `INSERT INTO role SET ?`
            db.query(sql, {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.dept_id
                },
                function(err, res) {
                    if (err) throw err;


                    console.log("WOW! There is a new role.");
                    optionStart();
                });
        });

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ADD EMPLOYEE
function newPerson() {
    const sql =
        `SELECT  r.title, r.id, r.salary 
        FROM role r`


    db.query(sql, function(err, res) {
        if (err) throw err;

        const person = res.map(({ title, id, salary }) => ({
            title: title,
            value: id,

            salary: salary
        }));


        personInsert(person);
    });
}

function personInsert(person) {

    inquirer
        .prompt([{
                type: "input",
                name: "first_name",
                message: "New employee's First Name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "New employee's Last Name?"
            },
            {
                type: "list",
                name: "role_id",
                message: "What role will the new Employee have?? Choose by id!!",
                choices: person
            },

        ])
        .then(function(answer) {
            console.log(answer);

            const sql = `INSERT INTO employee SET ?`
            db.query(sql, {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                },
                function(err, res) {
                    if (err) throw err;


                    console.log("WELCOME!!!!!");

                    optionStart();
                });
        });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
optionStart()