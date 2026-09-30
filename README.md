# express api

A simple REST API in Node.js

API Endpoints

| Methods     | Urls             |Description            |
| ----------- | -----------      | -----------        |
| GET         | api/employees    |Get all employees           |
| GET         | api/employees/id |Get a specific employee         |
| POST        | api/employees    |Create a new employee         |
| PUT        | api/employees/id    |Update an existing employee|
| DELETE        | api/employees/id    |Delete an existing employee|

## Quick Start

Clone the repo.

```bash
https://github.com/zagaris/express-api.git
cd express-api
```
Create the .env.dev file.

```bash
DB_URL = localhost/my-employees
PORT = 5000
```
Create the .env.prod file.

```bash
DB_URL = myhost.me/my-employees
PORT = 8080
```

Install the dependencies.

```bash
npm install
```
To start the express server in dev mode, run the following.

```bash
npm run dev
```

To start the express server in prod mode, run the following.

```bash
npm run prod
```

For more details check [Build a Restful CRUD API with Node.js](https://dev.to/zagaris/build-a-restful-crud-api-with-node-js-2334).


