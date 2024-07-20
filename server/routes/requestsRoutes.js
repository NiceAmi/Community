const express = require('express');
const requestBLL = require('../BLL/requestsBLL');
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
        let response = await requestBLL.getAllRequests(req.token);
        res.send(response);

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error: ' + err.message });
    }
});
router.get('/:requestId', async (req, res) => {
    try {
        let { requestId } = req.params;
        let response = await requestBLL.getRequestById(req.token, requestId);

        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const response = await requestBLL.createRequest(req.token, req.body);
        if (response.message === 'Request created successfully') {
            res.status(201).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error: ' + err.message });
    }
});

router.put('/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const obj = req.body;
        const response = await requestBLL.updateRequest(req.token, requestId, obj);
        if (response.message === 'Request updated successfully') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error: ' + err.message });
    }
})
router.delete('/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const response = await requestBLL.deleteRequest(req.token, requestId);
        if (response.message === 'Request deleted successfully') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error: ' + err.message });
    }
})

router.get('/request/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const response = await offersBLL.getOffersForRequest(req.token, requestId);
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

module.exports = router