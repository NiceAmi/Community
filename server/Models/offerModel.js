const { sql, poolPromise } = require('../config/dbConfig');

const getAllOffers = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Offers');
        return result.recordset;
    } catch (error) {
        console.log('Error getting all offers:', error);
        throw error;
    }
};

const getOfferById = async (offerId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OfferID', sql.Int, offerId)
            .query('SELECT * FROM Offers WHERE OfferID = @OfferID');
        return result.recordset[0];
    } catch (error) {
        console.log('Error getting offer by id:', error);
        throw error;
    }
};

const createOffer = async (offerData) => {
    try {
        const { UserID, Category, OfferName, Description, Location, Status, Date } = offerData;
        const pool = await poolPromise;
        const request = pool.request()
            .input('UserID', sql.Int, UserID)
            .input('Category', sql.NVarChar(50), Category)
            .input('OfferName', sql.NVarChar(50), OfferName)
            .input('Description', sql.NVarChar(255), Description)
            .input('Location', sql.NVarChar(255), Location)
            .input('Status', sql.NVarChar(50), Status);

        if (Date) {
            request.input('Date', sql.DateTime, new Date(Date));
        }

        const result = await request.query(`
            INSERT INTO Offers (UserID, Category, OfferName, Description, Location, Status${Date ? ', Date' : ''})
            VALUES (@UserID, @Category, @OfferName, @Description, @Location, @Status${Date ? ', @Date' : ''});
            SELECT SCOPE_IDENTITY() AS OfferID;
        `);
        return result.recordset[0];
    } catch (error) {
        console.log('Error creating offer:', error);
        throw error;
    }
};

const updateOffer = async (offerId, offerData) => {
    try {
        const { UserID, Category, OfferName, Description, Location, Status } = offerData;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OfferID', sql.Int, offerId)
            .input('UserID', sql.Int, UserID)
            .input('Category', sql.NVarChar(50), Category)
            .input('OfferName', sql.NVarChar(50), OfferName)
            .input('Description', sql.NVarChar(255), Description)
            .input('Location', sql.NVarChar(255), Location)
            .input('Status', sql.NVarChar(50), Status)
            .query(`
                UPDATE Offers 
                SET UserID = @UserID, Category = @Category, OfferName = @OfferName,  
                    Description = @Description, Location = @Location, Status = @Status
                WHERE OfferID = @OfferID
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error updating offer:', error);
        throw error;
    }
};

const deleteOffer = async (offerId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('OfferID', sql.Int, offerId)
            .query('DELETE FROM Offers WHERE OfferID = @OfferID');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error deleting offer:', error);
        throw error;
    }
};

const getOffersByRequestId = async (requestId) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request()
        .input('RequestID', sql.Int, requestId)
        .query(`SELECT * FROM Offers WHERE RequestID = @RequestID`);
        return result.recordset;
    }catch (error) {
        console.log('Error getting offers by request id:' ,error);
        return {error: error.message};
    }
};

module.exports = {
    getAllOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    getOffersByRequestId
};
