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
            message: 'Choose',
            name: 'nextOption',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Departments', 'Add A Department', 'View All Roles', 'Add A Role']
        }])
        .then(
            function(data) {
                if (data.nextOption === 'View All Employees') {
                    allEmployees()
                } else if (data.nextOption === 'Add Employee') {
                    // addEmployees()

                } else if (data.nextOption === 'Update Employee Role') {
                    // updateEmployeeRole();
                } else if (data.nextOption === 'View All Departments') {
                    // createIntern()

                } else if (data.nextOption === 'Add A Department') {
                    // createIntern()

                } else if (data.nextOption === 'Add A Department') {
                    // createIntern()

                } else if (data.nextOption === 'Add A Department') {
                    // createIntern()

                }
            }
        )
}

function allEmployees() {

    const sql = `SELECT * FROM employee`;

    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.table(rows)
        optionStart()
    });


}

optionStart()