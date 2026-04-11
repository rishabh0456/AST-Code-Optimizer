const express = require('express');
const router = express.Router();

const { 
    parseSourceCode, 
    transpileCode,
    reviewCode,
    getLogicFlow,
    fixCode,
    analyzeAlgorithm
} = require('../controllers/optiController');

router.post('/parse', parseSourceCode);

router.post('/transpile', transpileCode);

router.post('/review', reviewCode);

router.post('/logic-flow', getLogicFlow);

router.post('/fix', fixCode);

router.post('/analyze', analyzeAlgorithm);

module.exports = router;