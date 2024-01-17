// src/index.js
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('EPSI 2024, Master, Dev2, Pierre Yvenou, Arthur Lory, Simon Huchede, Alexis Bertin');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});