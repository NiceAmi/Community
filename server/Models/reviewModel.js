const { sql, poolPromise } = require('../config/dbConfig');

const getAllReviews = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Reviews');
        return result.recordset;
    } catch (error) {
        console.log('Error getting all Reviews:', error);
        throw error;
    }
};

const getReviewById = async (reviewId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ReviewID', sql.Int, reviewId)
            .query('SELECT * FROM Reviews WHERE ReviewID = @ReviewID');
        return result.recordset[0];
    } catch (error) {
        console.log('Error getting Review by id:', error);
        throw error;
    }
};

const createReview = async (reviewData) => {
    try {
        const { ReviewerID, RevieweeID, Rating, ReviewText } = reviewData;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ReviewerID', sql.Int, ReviewerID)
            .input('RevieweeID', sql.Int, RevieweeID)
            .input('Rating', sql.Int, Rating)
            .input('ReviewText', sql.NVarChar(500), ReviewText)
            .query(`
                INSERT INTO Reviews (ReviewerID, RevieweeID, Rating, ReviewText)
                VALUES (@ReviewerID, @RevieweeID, @Rating, @ReviewText);
                SELECT SCOPE_IDENTITY() AS ReviewID;
            `);
        return result.recordset[0];
    } catch (error) {
        console.log('Error creating Review:', error);
        throw error;
    }
};

const updateReview = async (reviewId, reviewData) => {
    try {
        const { Rating, ReviewText } = reviewData;  
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ReviewID', sql.Int, reviewId)
            .input('Rating', sql.Int, Rating)
            .input('ReviewText', sql.NVarChar(500), ReviewText)
            .query(`
                UPDATE Reviews 
                SET Rating = @Rating, ReviewText = @ReviewText
                WHERE ReviewID = @ReviewID
            `);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error updating Review:', error);
        throw error;
    }
};


const deleteReview = async (reviewId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ReviewID', sql.Int, reviewId)
            .query('DELETE FROM Reviews WHERE ReviewID = @ReviewID');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.log('Error deleting Review:', error);
        throw error;
    }
};

const getUserReviews = async (userId) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request()
        .input('UserID', sql.Int, userId)
        .query(`
            Select r.*, u.UserName as ReviewerUserName
            FROM Reviews r
            JOIN Users u ON r.ReviewerID = u.UserID
            WHERE r.RevieweeID = @UserID
            ORDER BY r.Timestamp DESC
            ` );
        return result.recordset;
    }catch (error) {
        console.log('Error getting Reviews by user id:' ,error);
        return {error: error.message};
    }
};

module.exports = {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getUserReviews
};