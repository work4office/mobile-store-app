const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Home route', req.url);
    res.send('Welcome to the Mobile Store API');
});

module.exports = router;