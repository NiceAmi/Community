const jwt = require('jsonwebtoken');
const messageModel = require('../Models/messageModel');
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

const validateMessageData = (messageData) => {
    if (!messageData.SenderID || !messageData.ReceiverID || !messageData.MessageText) {
        return { error: true, message: "Missing required fields" };
    }
    if (typeof messageData.SenderID !== 'number' || typeof messageData.ReceiverID !== 'number') {
        return { error: true, message: "Invalid user IDs" };
    }
    if (typeof messageData.MessageText !== 'string' || messageData.MessageText.length > 1000) {
        return { error: true, message: "Invalid message text" };
    }
    return { error: false };
};

const getAllMessages = async (token, page, pageSize) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const messages = await messageModel.getAllMessages(page, pageSize);
        return messages.length > 0 ? messages : { message: 'No messages found' };
    } catch (err) {
        console.error('Error in getting all messages:', err);
        return { error: true, message: `Error retrieving messages: ${err.message}` };
    }
};

const getMessageById = async (token, messageId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const message = await messageModel.getMessageById(messageId);
        return message ? message : { message: 'No message found with this ID' };
    } catch (err) {
        console.error('Error in get message by id:', err);
        return { error: true, message: `Error retrieving message: ${err.message}` };
    }
};

const createNewMessage = async (token, messageData) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    const dataValidation = validateMessageData(messageData);
    if (dataValidation.error) return dataValidation;

    try {
        const result = await messageModel.createMessage(messageData);
        return { message: 'Message created successfully', messageId: result.MessageID };
    } catch (err) {
        console.error('Error in creating new message:', err);
        return { error: true, message: `Error creating message: ${err.message}` };
    }
};

const updateMessage = async (token, messageId, messageData) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await messageModel.updateMessage(messageId, messageData);
        return result ? { message: 'Message updated successfully' } : { message: 'No message found with this ID' };
    } catch (err) {
        console.error('Error in updating message:', err);
        return { error: true, message: `Error updating message: ${err.message}` };
    }
};

const deleteMessage = async (token, messageId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await messageModel.deleteMessage(messageId);
        return result ? { message: 'Message deleted successfully' } : { message: 'No message found with this ID' };
    } catch (err) {
        console.error('Error in deleting message:', err);
        return { error: true, message: `Error deleting message: ${err.message}` };
    }
};

const getUserMessages = async (token, userId, page, pageSize) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const messages = await messageModel.getUserMessages(userId, page, pageSize);
        return messages.length > 0 ? messages : { message: 'No messages found for this user' };
    } catch (err) {
        console.error('Error in getting user messages:', err);
        return { error: true, message: `Error retrieving messages: ${err.message}` };
    }
};

const getMessagesBetweenUsers = async (token, user1Id, user2Id, page, pageSize) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const messages = await messageModel.getMessagesBetweenUsers(user1Id, user2Id, page, pageSize);
        return messages.length > 0 ? messages : { message: 'No messages found between these users' };
    } catch (err) {
        console.error('Error in getting messages between users:', err);
        return { error: true, message: `Error retrieving messages: ${err.message}` };
    }
};

const getUnreadMessageCount = async (token, userId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const count = await messageModel.getUnreadMessageCount(userId);
        return { unreadCount: count };
    } catch (error) {
        console.error('Error in getting unread message count:', error);
        return { error: true, message: `Error retrieving unread message count: ${error.message}` };
    }
}

module.exports = {
    getAllMessages,
    getMessageById,
    createNewMessage,
    updateMessage,
    deleteMessage,
    getUserMessages,
    getMessagesBetweenUsers,
    getUnreadMessageCount
};