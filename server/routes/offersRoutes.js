const express = require('express');
const offersBLL = require('../BLL/offersBLL'); 
const router = express.Router();

const checkToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }
    req.token = token;
    next();
};
router.use(checkToken);

router.get('/', async (req, res) => {
    try {
        let response = await offersBLL.getAllOffers(req.token); 
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.get('/:offerId', async (req, res) => {
    try {
        let { offerId } = req.params;
        let response = await offersBLL.getOfferById(req.token, offerId); 
        if (response) {
            res.status(200).send(response);
        } else {
            res.status(404).send({ message: 'Offer not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const response = await offersBLL.createNewOffer(req.token, req.body);
        if (response.error) {
            res.status(400).send(response);
        } else {
            res.status(201).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.put('/:offerId', async (req, res) => {
    try {
        const { offerId } = req.params;
        const obj = req.body;
        const response = await offersBLL.updateOffer(req.token, offerId, obj);
        if (response.message === 'Offer updated successfully') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.delete('/:offerId', async (req, res) => {
    try {
        const { offerId } = req.params;
        const response = await offersBLL.deleteOffer(req.token, offerId); 
        if (response.message === 'Offer deleted successfully') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.get('/offer/:offerId', async (req, res) => {
    try {
        const { offerId } = req.params;
        const response = await offersBLL.getOffersForOffer(req.token, offerId); 
        if (response.error) {
            res.status(404).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

module.exports = router;