const { sql, poolPromise } = require('../config/dbConfig');


const getAllUsers = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Users');
        return result.recordset;
    } catch (error) {
        console.log('Error getting all users:', error);
        throw error;
    }
};

const getUserById = async (userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .query('SELECT * FROM Users WHERE UserID = @UserID');
        return result.recordset[0];
    } catch (error) {
        console.log('Error getting user by id:', error);
        throw error;
    }
};

const updateUser = async (userId, userData) => {
    try {
        const { Username, Fname, Lname, Address, Email } = userData;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .input('Username', sql.NVarChar(50), Username)
            .input('Fname', sql.NVarChar(50), Fname)
            .input('Lname', sql.NVarChar(50), Lname)
            .input('Address', sql.NVarChar(255), Address)
            .input('Email', sql.NVarChar(100), Email)
            .query(`
                UPDATE Users 
                SET Username = @Username, Fname = @Fname, Lname = @Lname, 
                    Address = @Address, Email = @Email
                WHERE UserID = @UserID
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error updating user:', error);
        throw error;
    }
};

const deleteUser = async (userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .query('DELETE FROM Users WHERE UserID = @UserID');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error deleting user:', error);
        throw error;
    }
};

const updateUserImage = async (userId, imageUrl) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .input('ProfileImageURL', sql.NVarChar(255), imageUrl)
            .query('UPDATE Users SET ProfileImageURL = @ProfileImageURL WHERE UserID = @UserID');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error updating user image:', error);
        throw error;
    }
}

const getUserRequests = async (userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .query('SELECT * FROM Requests WHERE UserID = @UserID');
        return result.recordset;
    } catch (error) {
        console.log('Error getting user requests:', error);
        throw error;
    }
};

const getUserOffers = async (userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .query('SELECT * FROM Offers WHERE UserID = @UserID');
        return result.recordset;
    } catch (error) {
        console.log('Error getting user offers:', error);
        throw error;
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserImage,
    getUserRequests,
    getUserOffers,
};