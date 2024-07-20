require('events').EventEmitter.defaultMaxListeners = 15;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { poolPromise } = require('./config/dbConfig');
const routes = [
    { path: '/api/auth', module: './routes/authRoutes' },
    { path: '/api/users', module: './routes/usersRoutes' },
    { path: '/api/requests', module: './routes/requestsRoutes' },
    { path: '/api/offers', module: './routes/offersRoutes' },
    { path: '/api/messages', module: './routes/messagesRoutes' },
    { path: '/api/reviews', module: './routes/reviewsRoutes' }
  ];
const app = express();
const port = process.env.PORT || 5000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 AS number');
    res.send(result.recordset);
  } catch (err) {
    res.status(500).send('Database Connection Failed: ' + err);
  }
});


routes.forEach(route => app.use(route.path, require(route.module)));
app.use('/uploads', express.static(uploadDir));app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
