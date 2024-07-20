const jwt = require('jsonwebtoken');
const reviewModel = require('../Models/reviewModel');
require('dotenv').config();

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return { error: true, message: "Invalid token" };
        }
        if (err.name === 'TokenExpiredError') {
            return { error: true, message: "Token expired" };
        }
        return { error: true, message: `Error verifying token: ${err.message}` };
    }
};

const getAllReviews = async (token) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const reviews = await reviewModel.getAllReviews();
        return reviews.length > 0 ? reviews : { message: 'No reviews found' };
    } catch (err) {
        console.error('Error in geting all reviews:', err);
        return { error: true, message: `Error retrieving reviews: ${err.message}` };
    }
};

const getReviewById = async (token, reviewId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const review = await reviewModel.getReviewById(reviewId);
        return review ? review : { review: 'No review found with this ID' };
    } catch (err) {
        console.error('Error in get review by id:', err);
        return { error: true, message: `Error retrieving review: ${err.message}` };
    }
};

const createNewReview = async (token, reviewData) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;

    if (!reviewData.ReviewText) {
        return { error: true, message: 'ReviewText cannot be empty' };
    }
    try {
        const result = await reviewModel.createReview(reviewData);
        return { message: 'Review created successfully', reviewId: result.ReviewID };
    } catch (err) {
        console.error('Error in creating new review:', err);
        return { error: true, message: `Error creating review: ${err.message}` };
    }
};


const updateReview = async (token, reviewId, reviewData) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await reviewModel.updateReview(reviewId, reviewData);
        return result ? { message: 'Review updated successfully' } : { message: 'No review found with this ID' };
    } catch (err) {
        console.error('Error in updating review:', err);
        return { error: true, message: `Error updating review: ${err.message}` };
    }
};

const deleteReview = async (token, reviewId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await reviewModel.deleteReview(reviewId);
        return result ? { message: 'review deleted successfully' } : { message: 'No review found with this ID' };
    } catch (err) {
        console.error('Error in deleteing review:', err);
        return { error: true, message: `Error deleting review: ${err.message}` };
    }
};

const getUserReviews = async (token, userId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const reviews = await reviewModel.getUserReviews(userId);
        return reviews.length > 0 ? reviews : { message: 'No reviews found for this user'};
    } catch (err) {
        console.error('Error in getting user reviews:', err);
        return { error: true, message: `Error retrieving reviews: ${err.message}` };
    }
};

module.exports = {
 getAllReviews,
 getReviewById,
 createNewReview,
 updateReview,
 deleteReview,
 getUserReviews,
};