const { sql, poolPromise } = require('../config/dbConfig');

const getUserByUsername = async (username) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Username', sql.NVarChar, username)
      .query(`
        SELECT UserID, Username, Fname, Lname, Address, Email, PasswordHash, ProfileImageURL 
        FROM Users 
        WHERE Username = @Username
      `);
    return result.recordset[0];
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const { Username, Fname, Lname, Address, PasswordHash, Email } = userData;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Username', sql.NVarChar(50), Username)
      .input('Fname', sql.NVarChar(50), Fname)
      .input('Lname', sql.NVarChar(50), Lname)
      .input('Address', sql.NVarChar(255), Address)
      .input('PasswordHash', sql.NVarChar(255), PasswordHash)
      .input('Email', sql.NVarChar(100), Email)
      .query(`
        INSERT INTO Users (Username, Fname, Lname, Address, PasswordHash, Email)
        VALUES (@Username, @Fname, @Lname, @Address, @PasswordHash, @Email);
      `);
    return result.rowsAffected[0] > 0; 
  } catch (err) {
    console.log(err);
    return false; 
  }
};

module.exports = {
  getUserByUsername,
  createUser
};