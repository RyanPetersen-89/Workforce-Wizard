# Workforce Wizard

Workforce Wizard is a command-line application that allows users to manage their company's employee database. Built using Node.js, Inquirer, and PostgreSQL, Workforce Wizard helps users view and organize their company's departments, roles, and employees while providing an easy-to-use interface to handle all essential employee management tasks.

- View all departments: Users will see a neatly formatted table that showcases all department names alongside their IDs.

- View all roles: Users can explore a table displaying job titles, role IDs, associated departments, and the respective salaries for each role.

- View all employees: Users can check out a detailed table with employee information including IDs, names, job titles, salaries and managers.

- Add a department: Users can enter the name of the new department and add it to the database.

- Add a role: Users can enter an employee's name, salary and department and add it to the employee database.

- Add an employee: Users can enter a new employee's first name, last name, role, and who their manager is and add it to the database.

- Update an employee role: Users can choose an employee and update their role as needed.

## Installation

To install Workforce Wizard:

- Clone the repository: https://github.com/RyanPetersen-89/Workforce-Wizard.git

- Navigate to the project directory

- Open the terminal and install the dependencies by running the command: `npm install`

- Set up the PostgreSQL database:

  - Enter 'psql -U postgres' to open the PostgreSQL command line interface. If prompted, input your password.
  - To set up the database, type '\i schema.sql' and press Enter.
  - Next, type '\i seeds.sql' and press Enter to insert the seed data. Now your database is ready to use!

- Remove '.EXAMPLE' from the .env.EXAMPLE file renaming it to .env

- Configure that .env file with your database credentials

## Usage

- Start the application, in the terminal run the command: `node index.js`

- Follow the prompts to navigate through the menu options.

[Link to Walk Through Video](https://drive.google.com/file/d/1l091JL6wqjgmRTdUcmvPsxegJ5v_XH6f/view?usp=drive_link)

![Screenshot of Workforce Wizard](./imgs/Screenshot%202024-06-26%20213508.png)

## Credits

## This project was made possible with the help of:

### [Adam Rosenberg](https://github.com/AcoderRose)

### [Kaila Ronquillo](https://github.com/girlnotfound)