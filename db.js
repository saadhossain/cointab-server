const { Pool } = require('pg')
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    database: 'userdb',
    password: 'SaadHossainDev',
})


module.exports = pool