const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/example', (req, res) => {
    res.send('Product route example');
});

module.exports = router;
