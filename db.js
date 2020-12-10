const Pool = require('pg').Pool


const pool = new Pool ({
    user: "postgres",
    password: "patronage",
    host: "localhost",
    database: 'pilerun',
    port: 5432,
});

module.exports = pool;