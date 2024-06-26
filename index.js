require('dotenv').config(); // load environment variables

const inquirer = require('inquirer'); // import inquirer for prompts

// import functions for database queries
const {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require('./query');

// main menu function
const mainMenu = async () => {
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ],
  });
  switch (answer.action) {
    case 'View all departments':
      const departments = await viewDepartments();
      console.table(departments);
      break;
    case 'View all roles':
      const roles = await viewRoles();
      console.table(roles);
      break;
    case 'View all employees':
      const employees = await viewEmployees();
      console.table(employees);
      break;
    case 'Add a department':
      await promptAddDepartment();
      break;
    case 'Add a role':
      await promptAddRole();
      break;
    case 'Add an employee':
      await promptAddEmployee();
      break;
    case 'Update an employee role':
      await promptUpdateEmployeeRole();
      break;
    case 'Exit':
      process.exit();
  }
  mainMenu(); // loop back to main menu after an action is completed
};

// prompt to add a new department
const promptAddDepartment = async () => {
  const answer = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the name of the new department:',
  });
  await addDepartment(answer.name);
};

// prompt to add a new role
const promptAddRole = async () => {
  const departments = await viewDepartments();
  const departmentNames = departments.map(dep => dep.name);
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the new role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the new role:',
    },
    {
      type: 'list',
      name: 'department',
      message: 'Select the department for the new role:',
      choices: departmentNames,
    },
  ]);
  await addRole(answers.title, answers.salary, answers.department);
};

// prompt to add a new employee
const promptAddEmployee = async () => {
  const roles = await viewRoles();
  const roleTitles = roles.map(role => role.title);
  const managers = await viewEmployees();
  const managerNames = managers.map(mgr => `${mgr.first_name} ${mgr.last_name}`);
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the first name of the new employee:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the last name of the new employee:',
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select the role for the new employee:',
      choices: roleTitles,
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Select the manager for the new employee:',
      choices: managerNames,
    },
  ]);
  await addEmployee(answers.first_name, answers.last_name, answers.role, answers.manager);
};

// prompt to update an employee's role
const promptUpdateEmployeeRole = async () => {
  const employees = await viewEmployees();
  const employeeNames = employees.map(emp => `${emp.first_name} ${emp.last_name}`);
  const roles = await viewRoles();
  const roleTitles = roles.map(role => role.title);
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Select the employee to update:',
      choices: employeeNames,
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select the new role for the employee:',
      choices: roleTitles,
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Select the new manager for the employee:',
      choices: employeeNames, // Assuming managers are also employees
    },
  ]);
  await updateEmployeeRole(answers.employee, answers.role, answers.manager);
};
// start the application
mainMenu();