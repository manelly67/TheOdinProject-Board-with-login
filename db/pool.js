const { Pool } = require('pg');

const myObject = {};
require('dotenv').config({ processEnv: myObject });

// All of the following properties should be read from environment variables

const connectionString =
  process.env.DATABASE_URL ||
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