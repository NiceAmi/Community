const { sql, poolPromise } = require('../config/dbConfig');

const getAllMessages = async (page = 1, pageSize = 20) => {
    try {
        const pool = await poolPromise;
        const offset = (page - 1) * pageSize;
        const result = await pool.request()
            .input('Offset', sql.Int, offset)
            .input('PageSize', sql.Int, pageSize)
            .query('SELECT * FROM Messages ORDER BY Timestamp DESC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY');
        return result.recordset;
    } catch (error) {
        console.log('Error getting all Messages:', error);
        throw error;
    }
};

const getMessageById = async (MessageId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MessageID', sql.Int, MessageId)
            .query('SELECT * FROM Messages WHERE MessageID = @MessageID');
        return result.recordset[0];
    } catch (error) {
        console.log('Error getting Message by id:', error);
        throw error;
    }
};

const createMessage = async (MessageData) => {
    try {
        const {SenderID, ReceiverID, MessageText} = MessageData;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('SenderID', sql.Int, SenderID)
            .input('ReceiverID', sql.Int, ReceiverID)
            .input('MessageText', sql.NVarChar(sql.MAX), MessageText)
            .query(`
                INSERT INTO Messages (SenderID, ReceiverID, MessageText)
                VALUES (@SenderID, @ReceiverID, @MessageText);
                SELECT SCOPE_IDENTITY() AS MessageID;
            `);
        return result.recordset[0];
    } catch (error) {
        console.log('Error creating Message:', error);
        throw error;
    }
};

const updateMessage = async (MessageId, MessageData) => {
    try {
        const { MessageTEXT, IsRead } = MessageData;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MessageID', sql.Int, MessageId)
            .input('MessageTEXT', sql.NVarChar(sql.MAX), MessageTEXT)
            .input('IsRead', sql.Bit, IsRead)
            .query(`
                UPDATE Messages 
                SET MessageTEXT = @MessageTEXT, IsRead = @IsRead
                WHERE MessageID = @MessageID
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error updating Message:', error);
        throw error;
    }
};

const deleteMessage = async (MessageId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MessageID', sql.Int, MessageId)
            .query('DELETE FROM Messages WHERE MessageID = @MessageID');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error deleting Message:', error);
        throw error;
    }
};

const getUserMessages = async (userId, page = 1, pageSize = 20) => {
    try {
        const pool = await poolPromise;
        const offset = (page - 1) * pageSize;
        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .input('Offset', sql.Int, offset)
            .input('PageSize', sql.Int, pageSize)
            .query(`
                SELECT * FROM Messages 
                WHERE SenderID = @UserID OR ReceiverID = @UserID
                ORDER BY Timestamp DESC
                OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
            `);
        return result.recordset;
    } catch (error) {
        console.log('Error getting Messages by user id:', error);
        throw error;
    }
};

const getMessagesBetweenUsers = async (user1Id, user2Id, page = 1, pageSize = 20) => {
    try {
        const pool = await poolPromise;
        const offset = (page - 1) * pageSize;
        const result = await pool.request()
            .input('User1ID', sql.Int, user1Id)
            .input('User2ID', sql.Int, user2Id)
            .input('Offset', sql.Int, offset)
            .input('PageSize', sql.Int, pageSize)
            .query(`
                SELECT * FROM Messages 
                WHERE (SenderID = @User1ID AND ReceiverID = @User2ID)
                   OR (SenderID = @User2ID AND ReceiverID = @User1ID)
                ORDER BY Timestamp DESC
                OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
            `);
        return result.recordset;
    } catch (error) {
        console.log('Error getting Messages between users:', error);
        throw error;
    }
};

const getUnreadMessageCount = async (userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .query('SELECT COUNT(*) AS UnreaCount FROM Messages WHERE ReceuverID = @UserID AND IsRead = 0');
        return result.recordset[0].UnreadCount;
    }catch(error) {
        console.log('Error getting unread message count: ' , error);
        throw error;
    }
}

module.exports = {
    getAllMessages,
    getMessageById,
    createMessage,
    updateMessage,
    deleteMessage,
    getUserMessages,
    getMessagesBetweenUsers,
    getUnreadMessageCount,
};