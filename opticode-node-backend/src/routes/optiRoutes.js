const express = require('express');
const router = express.Router();

const { 
    parseSourceCode, 
    transpileCode 
} = require('../controllers/optiController');

router.post('/parse', parseSourceCode);

router.post('/transpile', transpileCode);

module.exports = router;