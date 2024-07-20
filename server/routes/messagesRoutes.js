const express = require('express');
const messagesBLL = require('../BLL/messagesBLL');
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
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        let response = await messagesBLL.getAllMessages(req.token, page, pageSize);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.get('/:messageId', async (req, res) => {
    try {
        let { messageId } = req.params;
        let response = await messagesBLL.getMessageById(req.token, messageId);
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

router.post('/', async (req, res) => {
    try {
        const response = await messagesBLL.createNewMessage(req.token, req.body);
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

router.put('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const response = await messagesBLL.updateMessage(req.token, messageId, req.body);
        if (response.error) {
            res.status(400).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.delete('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const response = await messagesBLL.deleteMessage(req.token, messageId);
        if (response.error) {
            res.status(400).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const response = await messagesBLL.getUserMessages(req.token, userId, page, pageSize);
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

router.get('/between/:user1Id/:user2Id', async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const response = await messagesBLL.getMessagesBetweenUsers(req.token, user1Id, user2Id, page, pageSize);
        if (response.error) {
            res.status(404).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (error) {
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.get('/unread/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await messagesBLL.getUnreadMessageCount(req.token, userId);
        if (response.error) {
            res.status(400).send(response);
        } else {
            res.status(200).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
})

module.exports = router;