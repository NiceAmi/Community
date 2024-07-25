const express = require('express');
const usersBLL = require('../BLL/usersBLL');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const checkToken = (req, res, next) => {
    const token = req.headers['authorization'] || req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }
    req.token = token;
    next();
};

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage});

router.post('/register', async (req, res) => {
    const { userName, age, email, password } = req.body;
    try {
        const response = await usersBLL.register(userName, age, email, password);
        res.status(response === "User registered successfully" ? 201 : 400).json({ message: response });
    } catch (error) {
        console.error('Error in register route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const response = await usersBLL.login(userName, password);
        res.status(response.token ? 200 : 400).json(response.token ? response : { message: response });
    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.use(checkToken);

router.get('/', async (req, res) => {
    try {
        const response = await usersBLL.getAllUsers(req.token);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting all users route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const response = await usersBLL.getUserById(req.token, userId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const obj = req.body;
    try {
        const response = await usersBLL.updateUser(req.token, userId, obj);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const response = await usersBLL.deleteUser(req.token, userId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/:userId/profile-image', upload.single('image'), async (req, res) => {
    const { userId } = req.params;
    const imageUrl = `/uploads/${req.file.filename}`;
    try {
        const response = await usersBLL.updateUserImage(req.token, userId, imageUrl);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating user image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:userId/requests', async (req, res) => {
    const { userId } = req.params;
    try {
        const response = await usersBLL.getUserRequests(req.token, userId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting user requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:userId/offers', async (req, res) => {
    const { userId } = req.params;
    try {
        const response = await usersBLL.getUserOffers(req.token, userId);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error getting user offers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
