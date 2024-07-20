const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'AMI\\SQLEXPRESS',
  database: process.env.DB_NAME || 'Community',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    enableArithAbort: true
  },
  user: process.env.DB_USER || 'connect',
  password: process.env.DB_PASSWORD
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed: ', err));

module.exports = {
  sql, poolPromise
};