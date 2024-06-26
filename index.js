require("dotenv").config();
var inquirer = require("inquirer");
const { Pool } = require("pg");
const Query = require("./query");

// Using .env file for enhanced security
const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE,
});

pool.connect();

const query = new Query();

const runInq = async () => {
  // Declare answer variable here to ensure it has the necessary scope.
  let answer;
  try {
    answer = await inquirer.prompt([
      // Options for Inquirer
      {
        type: "list",
        name: "menu",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ]);
    // Handle error gracefully if it occurs
  } catch (error) {
    if (error.isTtyError) {
      console.error("Unable to render the prompt in the current environment.");
    } else {
      console.error(error);
    }
  }
  // An array is declared to hold follow-up questions for certain routes.
  const question = [];
  switch (answer.menu) {
    case "view all departments":
      // Function for displaying current departments table.
      const viewDepartments = async () => {
        const output = await query.seeDepartments();
        console.table(output.rows);
      };
      // Before proceeding to the next main menu instance, all functions utilize await to guarantee that results are displayed.
      await viewDepartments();
      break;

    case "view all roles":
      // Function for displaying roles table.
      const viewRoles = async () => {
        const output = await query.seeRoles();
        console.table(output.rows);
      };
      await viewRoles();
      break;

    case "view all employees":
      // Function for displaying employees table.
      const viewEmployees = async () => {
        const output = await query.seeEmployees();
        console.table(output.rows);
      };
      await viewEmployees();
      break;

    case "add a department":
      const addDep = async () => {
        // Follow up question for department to question array.
        question.push({
          type: "input",
          name: "department",
          message: "Department name? ",
        });
      };
      await addDep();
      break;

    case "add a role":
      // Generates an array containing department names.
      let allDepartments = [];
      const depList = await query.seeDepartments();

      for (deps of depList.rows) {
        allDepartments.push(deps.name);
      }
      // Follow up question for role to question array.
      question.push(
        { type: "input", name: "role", message: "Role? " },
        { type: "input", name: "salary", message: "Salary? " },
        { type: "list", name: "departments", choices: allDepartments }
      );
      break;

    case "add an employee":
      // data for roles gotten
      const result = await query.seeRoles();

      // data for manager gotten
      const resultMan = await query.seeManagers();

      // Transform into an array of manager names intended for use as a list question.
      const managerList = resultMan.rows.map((el) => el.manager);

      // Transform into an array of roles intended for use as a list question.
      const roleList = result.rows.map((el) => el.title);

      // Follow up questions for employee to question array.
      question.push(
        {
          type: "input",
          name: "firstName",
          message: "First name? ",
        },
        { type: "input", name: "lastName", message: "Last name? " },
        { type: "list", name: "role", choices: roleList },
        { type: "list", name: "manager", choices: managerList }
      );
      break;

    case "update an employee role":
      // Data for employees, roles, and managers gotten
      const resultEmp = await query.seeEmployees();

      const resultRoles = await query.seeRoles();

      const updateMan = await query.seeManagers();

      // Transform into arrays suitable for use as list questions.
      const updateManList = updateMan.rows.map((el) => el.manager);

      const employeeList = resultEmp.rows.map(
        (el) => el.first_name + " " + el.last_name
      );

      const rolesList = resultRoles.rows.map((el) => el.title);

      // Update questions for employee to question array.
      question.push(
        // List of employees on update.
        { type: "list", name: "employee", choices: employeeList },
        // List of roles on update.
        { type: "list", name: "roles", choices: rolesList },
        { type: "list", name: "manager", choices: updateManList }
      );
      break;

    default:
  }
  // Follow-up questions for the second stage stored in this variable.
  const answer2 = await inquirer.prompt(question);

  switch (answer.menu) {
    case "add a department":
      const insertDep = async () => {
        // In order to update data it is passed.
        await query.addDepartment(answer2.department);
        const output = await query.seeDepartments();
        // Table with update is displayed.
        console.table(output.rows);
      };

      await insertDep();
      break;

    case "add a role":
      const insertRole = async () => {
        await query.addRole(answer2);
        const output = await query.seeRoles();
        console.table(output.rows);
      };
      await insertRole();
      break;

    case "add an employee":
      const insertEmployee = async () => {
        await query.addEmployee(answer2);
        const output = await query.seeEmployees();
        console.table(output.rows);
      };
      await insertEmployee();
      break;

    case "update an employee role":
      const updateRole = async () => {
        await query.changeRole(answer2);
        const output = await query.seeEmployees();
        console.table(output.rows);
      };
      await updateRole();
      break;
  }
  // Implement recursive function calls in the program to create a loop that continues until the user chooses to quit via the Command Line Interface (CLI).
  runInq();
};

// Utilize recursion for the function to invoke itself.
runInq();