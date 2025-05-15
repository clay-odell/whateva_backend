const { Pool } = require('pg');

const pool = new Pool ({
    user: 'postgres',
    'host': "localhost",
    database: "whateva_web",
    password: "Iggy1302",
    port: 5432
});

module.exports = pool;