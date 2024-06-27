require('dotenv').config(); // load environment variables from .env file

const { Pool } = require('pg'); // import the PostgreSQL pool

// create a new pool instance with connection details
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// function to view all departments
const viewDepartments = async () => {
  try {
    const res = await pool.query('SELECT * FROM department'); // run query to get all departments
    return res.rows; // return results
  } catch (err) {
    console.error('Error executing query', err.stack); // log errors
  }
};

// function to view all roles
const viewRoles = async () => {
  try {
    const res = await pool.query('SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id'); // run query to get all roles
    return res.rows; 
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
};

// function to view all employees
const viewEmployees = async () => {
  try {
    const res = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, r.title AS role, r.salary, d.name AS department,
             COALESCE(m.first_name || ' ' || m.last_name, 'No manager') AS manager
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    return res.rows; // return results
  } catch (err) {
    console.error("Error executing query", err.stack); // log errors
  }
};

// function to view all managers
const viewManagers = async () => {
  try {
    const res = await pool.query(`SELECT DISTINCT m.first_name || ' ' || m.last_name AS manager
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id`); // run query to get all distinct managers
    return res.rows; 
  } catch (err) {
    console.error('Error executing query', err.stack); 
  }
};

// function to add a new department
const addDepartment = async (name) => {
  try {
    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]); // insert new department
    console.log(`Added department: ${name}`); // log confirmation
  } catch (err) {
    console.error('Error executing query', err.stack); // log errors
  }
};

// function to add a new role
const addRole = async (title, salary, departmentName) => {
  try {
    const depRes = await pool.query('SELECT id FROM department WHERE name = $1', [departmentName]); // get department ID by name
    const departmentId = depRes.rows[0].id; // extract department ID
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]); // insert a new role
    console.log(`Added role: ${title}`); // log confirmation
  } catch (err) {
    console.error('Error executing query', err.stack); // log errors
  }
};

// function to add a new employee
const addEmployee = async (first_name, last_name, roleTitle, managerName) => {
  try {
    const roleRes = await pool.query('SELECT id FROM role WHERE title = $1', [roleTitle]); // get role ID by title
    const roleId = roleRes.rows[0].id; // extract role ID

    let managerId = null;
    if (managerName) {
      const managerNames = managerName.split(' '); // split manager name into first and last names
      const managerRes = await pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [managerNames[0], managerNames[1]]); // get manager ID by name
      managerId = managerRes.rows[0]?.id || null; // extract manager ID or set to null
    }

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, roleId, managerId]); // insert new employee
    console.log(`Added employee: ${first_name} ${last_name}`); // log confirmation
  } catch (err) {
    console.error('Error executing query', err.stack); // log errors
  }
};

// function to update an employee's role
const updateEmployeeRole = async (employeeName, roleTitle, managerName) => {
  try {
    const employeeNames = employeeName.split(' '); // split employee name into first and last names
    const roleRes = await pool.query('SELECT id FROM role WHERE title = $1', [roleTitle]); // get role ID by title
    const roleId = roleRes.rows[0].id; // extract role ID

    const managerNames = managerName.split(' '); // split manager name into first and last names
    const managerRes = await pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [managerNames[0], managerNames[1]]); // get manager ID by name
    const managerId = managerRes.rows[0].id; // extract manager ID

    await pool.query('UPDATE employee SET role_id = $1, manager_id = $2 WHERE first_name = $3 AND last_name = $4', [roleId, managerId, employeeNames[0], employeeNames[1]]); // update employee role and manager
    console.log(`Updated employee: ${employeeName} with new role: ${roleTitle} and manager: ${managerName}`); // log confirmation
  } catch (err) {
    console.error('Error executing query', err.stack); // log errors
  }
};

// export all functions
module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  viewManagers,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};