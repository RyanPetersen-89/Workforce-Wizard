const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE,
});

function Query() {}

Query.prototype.seeDepartments = () => {
  // department table data gotten
  const output = pool.query("SELECT * FROM department");
  return output;
};

Query.prototype.seeRoles = () => {
  // role and department tables data gotten
  const output = pool.query(
    "SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id"
  );
  return output;
};

Query.prototype.seeEmployees = () => {
  // employee data returned
  const output =
    pool.query(`SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department,
    employee.first_name||' '||employee.last_name AS manager 
    FROM employee e LEFT JOIN employee ON e.manager_id=employee.id 
    JOIN role r ON e.role_id = r.id 
    JOIN department d ON r.department_id = d.id`);
  return output;
};

Query.prototype.seeManagers = async () => {
  // using employee table manager data is returned
  const output = pool.query(
    `SELECT DISTINCT employee.first_name||' '||employee.last_name AS manager FROM employee e LEFT JOIN employee ON e.manager_id=employee.id`
  );
  return output;
};

Query.prototype.addDepartment = (departmentName) => {
  // department table has new department added
  pool.query(
    `INSERT INTO department (name) VALUES ($1)`,
    [departmentName],
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Added Department!");
    }
  );
};

Query.prototype.addRole = async (inputData) => {
  // Extract properties from the inputData object and assign them to variables.
  const { role, salary, departments } = inputData;

  // department id variable gotten with query
  let depId = await pool.query(
    "SELECT department.id FROM department WHERE department.name = $1",
    [departments]
  );

  // table has role data added
  pool.query(
    `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`,
    [role, salary, depId.rows[0].id],
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Added role!");
    }
  );
};

Query.prototype.addEmployee = async (inputData) => {
  // Extract properties from the inputData object and assign them to individual variables.
  const { firstName, lastName, role, manager } = inputData;

  // role table id gotten with query
  let roleId = await pool.query("SELECT r.id FROM role r WHERE r.title = $1", [
    role,
  ]);

  // Splits the manager's name into an array containing the first name and last name for database insertion.
  managerName = manager.split(" ");

  // employee table manager id gotten with query
  let managerId = await pool.query(
    "SELECT e.id FROM employee e WHERE e.first_name =$1 AND e.last_name =$2",
    [managerName[0], managerName[1]]
  );

  // table has employee specifics added.
  pool.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`,
    [firstName, lastName, roleId.rows[0].id, managerId.rows[0].id],
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Added Employee!");
    }
  );
};

Query.prototype.changeRole = async (inputData) => {
  // Extract individual properties from the inputData object.
  const { employee, roles, manager } = inputData;

  // Split the manager's full name into an array containing the first and last names.
  managerName = manager.split(" ");

  // employee table manager id gotten from query.
  let managerId = await pool.query(
    "SELECT e.id FROM employee e WHERE e.first_name =$1 AND e.last_name =$2",
    [managerName[0], managerName[1]]
  );

  // role table id gotten from query.
  let roleId = await pool.query("SELECT r.id FROM role r WHERE r.title =$1", [
    roles,
  ]);
  // Split the manager's full name into an array containing the first and last names.
  employeeName = employee.split(" ");

  // Modify the role_id and manager_id columns in the employee table for the specified employee.
  pool.query(
    `UPDATE employee SET role_id=$1, manager_id=$2 WHERE first_name=$3 AND last_name=$4`,
    [roleId.rows[0].id, managerId.rows[0].id, employeeName[0], employeeName[1]],
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Updated specifics of Employee!");
    }
  );
};

module.exports = Query;