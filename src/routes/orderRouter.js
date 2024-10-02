const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/example', (req, res) => {
    res.send('Order route example');
});

module.exports = router;
