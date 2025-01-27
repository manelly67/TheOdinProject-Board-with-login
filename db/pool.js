const { Pool } = require('pg');

const myObject = {};
require('dotenv').config({ processEnv: myObject });

// All of the following properties should be read from environment variables
// The conexion follow this order first the process.env in deploy to online database
// second the online database from the local server and third the local database

const connectionString =
  process.env.DATABASE_URL || myObject.DATABASE_URL ||
  `postgresql://${myObject.ROLE_NAME}:${myObject.PASSWORD}@${myObject.HOST}:5432/${myObject.DATABASE}`;

module.exports = new Pool({
  connectionString: connectionString,
});

/* module.exports = new Pool({
    host: myObject.HOST, 
    user: myObject.ROLE_NAME,
    database: myObject.DATABASE,
    password: myObject.PASSWORD,
    port: 5432
  }); */