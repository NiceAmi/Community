const jwt = require('jsonwebtoken');
const offerModel = require('../Models/offerModel');
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

const getAllOffers = async (token) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const offers = await offerModel.getAllOffers();
        return offers.length > 0 ? offers : { message: 'No offers found' };
    } catch (err) {
        console.error('Error in getAllOffers:', err);
        return { error: true, message: `Error retrieving offers: ${err.message}` };
    }
};

const getOfferById = async (token, offerId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const offer = await offerModel.getOfferById(offerId);
        return offer ? offer : { message: 'No offer found with this ID' };
    } catch (err) {
        console.error('Error in getOfferById:', err);
        return { error: true, message: `Error retrieving offer: ${err.message}` };
    }
};


const createNewOffer = async (token, offerData) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await offerModel.createOffer(offerData);
        return { message: 'Offer created successfully', offerId: result.OfferID };
    } catch (err) {
        console.error('Error in createNewOffer:', err);
        return { error: true, message: `Error creating offer: ${err.message}` };
    }
};

const updateOffer = async (token, offerId, offerData) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await offerModel.updateOffer(offerId, offerData);
        return result ? { message: 'Offer updated successfully' } : { message: 'No offer found with this ID' };
    } catch (err) {
        console.error('Error in updateOffer:', err);
        return { error: true, message: `Error updating offer: ${err.message}` };
    }
};

const deleteOffer = async (token, offerId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const result = await offerModel.deleteOffer(offerId);
        return result ? { message: 'Offer deleted successfully' } : { message: 'No offer found with this ID' };
    } catch (err) {
        console.error('Error in deleteOffer:', err);
        return { error: true, message: `Error deleting offer: ${err.message}` };
    }
};

const getOffersForRequest = async (token, requestId) => {
    const validationResult = verifyToken(token);
    if (validationResult.error) return validationResult;
    try {
        const offers = await offerModel.getOffersByRequestId(requestId);
        return offers.length > 0 ? offers : { message: 'No offers found for this request' };
    } catch (err) {
        console.error('Error in getOffersForRequest:', err);
        return { error: true, message: `Error retrieving offers: ${err.message}` };
    }
};

module.exports = {
    getAllOffers,
    getOfferById,
    createNewOffer,
    updateOffer,
    deleteOffer,
    getOffersForRequest
};