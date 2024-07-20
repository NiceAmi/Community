const express = require('express');
const reviewsBLL = require('../BLL/reviewsBLL'); 
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
        let response = await reviewsBLL.getAllReviews(req.token); 
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.get('/:reviewId', async (req, res) => {
    try {
        let { reviewId } = req.params;
        let response = await reviewsBLL.getReviewById(req.token, reviewId); 
        if (response) {
            res.status(200).send(response);
        } else {
            res.status(404).send({ message: 'Review not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const response = await reviewsBLL.createNewReview(req.token, req.body);
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

router.put('/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;
        const obj = req.body;
        const response = await reviewsBLL.updateReview(req.token, reviewId, obj);
        if (response.message === 'Review updated successfully') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.delete('/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;
        const response = await reviewsBLL.deleteReview(req.token, reviewId); 
        if (response.message === 'Review deleted successfully') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await reviewsBLL.getUserReviews(req.token, userId);
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