const express = require('express');
const usersBLL = require('../BLL/usersBLL');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const checkToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }
    req.token = token;
    next();
};

router.use(checkToken);

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage});
router.get('/', async (req, res) => {
    let response = await usersBLL.getAllUsers(req.token);
    res.send(response);
});

router.get('/:userId', async (req, res) => {
    let { userId } = req.params;
    let response = await usersBLL.getUserById(req.token, userId);
    res.send(response);
});

router.put('/:userId', async (req, res) => {
    let { userId } = req.params;
    let obj = req.body;
    let response = await usersBLL.updateUser(req.token, userId, obj);
    res.send(response);
});

router.delete('/:userId', async (req, res) => {
    let { userId } = req.params;
    let response = await usersBLL.deleteUser(req.token, userId);
    res.send(response);
});

router.post('/:userId/profile-image', upload.single('image'), async(req, res) => {
    let { userId } = req.params;
    let imageUrl = `/uploads/${req.file.filename}`;
    let response = await usersBLL.updateUserImage(req.token, userId, imageUrl);
    res.send(response);
});

router.get('/:userId/requests', async (req, res) => {
    try {
        let { userId } = req.params;
        let response = await usersBLL.getUserRequests(req.token, userId);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});

router.get('/:userId/offers', async (req, res) => {
    try {
        let { userId } = req.params;
        let response = await usersBLL.getUserOffers(req.token, userId);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error: ' + error.message });
    }
});
module.exports = router;