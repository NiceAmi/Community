const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');
require('dotenv').config();

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return "Invalid token";
        }
        if (err.name === 'TokenExpiredError') {
            return "Token expired";
        }
        return `Error verifying token: ${err.message}`;
    }
};

const getAllUsers = async (token) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const users = await userModel.getAllUsers();
        return users.length > 0 ? users : { message: 'No users found' };
    } catch (err) {
        console.error('Error in getAllUsers:', err);
        return { error: true, message: `Error retrieving users: ${err.message}` };
    }
};

const getUserById = async (token, userId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const user = await userModel.getUserById(userId);
        return user ? user : { message: 'No user found with this ID' };
    } catch (err) {
        console.error('Error in getUserById:', err);
        return { error: true, message: `Error retrieving user: ${err.message}` };
    }
};


const updateUser = async (token, userId, userData) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await userModel.updateUser(userId, userData);
        return result ? { message: 'User updated successfully' } : { message: 'No user found with this ID' };
    } catch (err) {
        console.error('Error in updateUser:', err);
        return { error: true, message: `Error updating user: ${err.message}` };
    }
};

const deleteUser = async (token, userId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await userModel.deleteUser(userId);
        return result ? { message: 'User deleted successfully' } : { message: 'No user found with this ID' };
    } catch (err) {
        console.error('Error in deleteUser:', err);
        return { error: true, message: `Error deleting user: ${err.message}` };
    }
};

const updateUserImage = async (token, userId, imageUrl) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await userModel.updateUserImage(userId, imageUrl);
        return result ? { message: 'User image updated successfully', imageUrl } : { message: 'No user found with this ID' };
    } catch (err) {
        console.error('Error in updateUserImage:', err);
        return { error: true, message: `Error updating user image: ${err.message}` };
    }
}

const getUserRequests = async (token, userId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const requests = await userModel.getUserRequests(userId);
        return requests.length > 0 ? requests : { message: 'No requests found for this user' };
    } catch (err) {
        console.error('Error in getUserRequests:', err);
        return { error: true, message: `Error retrieving user requests: ${err.message}` };
    }
};

const getUserOffers = async (token, userId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const offers = await userModel.getUserOffers(userId);
        return offers.length > 0 ? offers : { message: 'No offers found for this user' };
    } catch (err) {
        console.error('Error in getUserOffers:', err);
        return { error: true, message: `Error retrieving user offers: ${err.message}` };
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