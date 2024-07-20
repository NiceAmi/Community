const { sql, poolPromise } = require('../config/dbConfig');

const getAllRequests = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Requests');
        return result.recordset;
    } catch (error) {
        console.log('Error getting all requests:', error);
        throw error;
    }
};

const getRequestById = async (requestId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('RequestID', sql.Int, requestId)
            .query('SELECT * FROM Requests WHERE RequestID = @RequestID');
        return result.recordset[0];
    } catch (error) {
        console.log('Error getting request by id:', error);
        throw error;
    }
};

const createRequest = async (requestData) => {
    try {
        const { UserID, Category, RequestName, Description, Location, Status, Date } = requestData;
        const pool = await poolPromise;
        const request = pool.request()
            .input('UserID', sql.Int, UserID)
            .input('Category', sql.NVarChar(50), Category)
            .input('RequestName', sql.NVarChar(50), RequestName)
            .input('Description', sql.NVarChar(255), Description)
            .input('Location', sql.NVarChar(255), Location)
            .input('Status', sql.NVarChar(50), Status);

        if (Date) {
            request.input('Date', sql.DateTime, new Date(Date));
        }

        const result = await request.query(`
            INSERT INTO Requests (UserID, Category, RequestName, Description, Location, Status${Date ? ', Date' : ''})
            VALUES (@UserID, @Category, @RequestName, @Description, @Location, @Status${Date ? ', @Date' : ''});
            SELECT SCOPE_IDENTITY() AS RequestID;
        `);
        return result.recordset[0];
    } catch (error) {
        console.log('Error creating request:', error);
        throw error;
    }
};

const updateRequest = async (requestId, requestData) => {
    try {
        const { UserID, Category, RequestName, Description, Location, Status } = requestData;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('RequestID', sql.Int, requestId)
            .input('UserID', sql.Int, UserID)
            .input('Category', sql.NVarChar(50), Category)
            .input('RequestName', sql.NVarChar(50), RequestName)
            .input('Description', sql.NVarChar(255), Description)
            .input('Location', sql.NVarChar(255), Location)
            .input('Status', sql.NVarChar(50), Status)
            .query(`
                UPDATE Requests 
                SET UserID = @UserID, Category = @Category, RequestName = @RequestName, 
                    Description = @Description, Location = @Location, Status = @Status
                WHERE RequestID = @RequestID
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error updating request:', error);
        throw error;
    }
};

const deleteRequest = async (requestId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('RequestID', sql.Int, requestId)
            .query('DELETE FROM Requests WHERE RequestID = @RequestID');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error deleting request:', error);
        throw error;
    }
};

const getRequestsByUserId = async (userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .query('SELECT * FROM Requests WHERE UserID = @UserID');
        return result.recordset;
    } catch (error) {
        console.log('Error getting requests by user id:', error);
        throw error;
    }
};

module.exports = {
    getAllRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
    getRequestsByUserId
};
