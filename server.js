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

// const questions = [{
//     type: 'list',
//     message: 'What would you like to do?',
//     name: 'task'
// }]

// function roles() {
//     inquirer.prompt(questions)
//         .then(function(data) {
//             console.log(data)
//         })
// }


function optionStart() {
    inquirer.prompt([{
            type: 'list',
            message: 'What would you like to view?',
            name: 'nextOption',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Departments', 'Add A Department', 'View All Roles', 'Add A Role']
                //list of options
        }])
        .then(
            function(data) {
                if (data.nextOption === 'View All Employees') {
                    allEmployees()
                } else if (data.nextOption === 'Add Employee') {
                    // addEmployees()

                } else if (data.nextOption === 'Update Employee Role') {
                    updateEm();
                } else if (data.nextOption === 'View All Departments') {
                    viewAllDept()

                } else if (data.nextOption === 'Add Department') {
                    // add()

                } else if (data.nextOption === 'View All Roles') {
                    viewAllRoles()

                } else if (data.nextOption === 'Add Role') {
                    // createIntern()

                }
            }
        )
        // calling function for each select
}

function allEmployees() {

    const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`;

    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.table(rows)
        optionStart()
    });


}


function viewAllDept() {

    const sql = `SELECT * FROM department `;

    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.table(rows)
        optionStart()
    });


}

function viewAllRoles() {

    const sql =
        `SELECT r.id, r.title, r.salary, d.name AS department
        FROM role r 
        LEFT JOIN department d
        ON d.id = r.department_id
        `;

    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.table(rows)
        optionStart()
    });


}

function updateEm() {
    employeeUpdate();

}

function employeeUpdate() {
    const sql =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r
      ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
      ON m.id = e.manager_id`
    db.query(sql, function(err, res) {
        if (err) throw err;
        const newEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${first_name} ${last_name}`
        }));
        console.table(res);
        roleUpdate(newEmployeeChoices);
    });
}

function roleUpdate(newEmployeeChoices) {
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
        promptEmployeeRole(newEmployeeChoices, roleUpdateTo);
    });
}

function promptEmployeeRole(newEmployeeChoices, roleUpdateTo) {

    inquirer
        .prompt([{
                type: "list",
                name: "employee_id",
                message: "Who will be promoted?",
                choices: newEmployeeChoices
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


optionStart()