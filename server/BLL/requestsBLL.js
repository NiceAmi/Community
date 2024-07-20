const jwt = require('jsonwebtoken');
const requestModel = require('../Models/requestModel');
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

const getAllRequests = async (token) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const requests = await requestModel.getAllRequests();
        return requests.length > 0 ? requests : { message: 'No requests found' };
    } catch (err) {
        console.error('Error in getAllRequests:', err);
        return { error: true, message: `Error retrieving requests: ${err.message}` };
    }
};

const getRequestById = async (token, requestId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const request = await requestModel.getRequestById(requestId);
        return request ? request : { message: 'No request found with this ID' };
    } catch (err) {
        console.error('Error in getRequestById:', err);
        return { error: true, message: `Error retrieving request: ${err.message}` };
    }
};

const createRequest = async (token, requestData) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await requestModel.createRequest(requestData);
        return { message: 'Request created successfully', requestId: result.RequestID };
    } catch (err) {
        console.error('Error in createRequest:', err);
        return { error: true, message: `Error creating request: ${err.message}` };
    }
};

const updateRequest = async (token, requestId, requestData) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await requestModel.updateRequest(requestId, requestData,);
        return result ? { message: 'Request updated successfully' } : { message: 'No request found with this ID' };
    } catch (err) {
        console.error('Error in updateRequest:', err);
        return { error: true, message: `Error updating request: ${err.message}` };
    }
};

const deleteRequest = async (token, requestId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await requestModel.deleteRequest(requestId);
        return result ? { message: 'Request deleted successfully' } : { message: 'No request found with this ID' };
    } catch (err) {
        console.error('Error in deleteRequest:', err);
        return { error: true, message: `Error deleting request: ${err.message}` };
    }
};

const getRequestsByUserId = async (token, userId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const requests = await requestModel.getRequestsByUserId(userId);
        return requests.length > 0 ? requests : { message: 'No requests found for this user' };
    } catch (err) {
        console.error('Error in getRequestsByUserId:', err);
        return { error: true, message: `Error retrieving requests: ${err.message}` };
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