// src/routes/optiRoutes.js
const express = require('express');
const router = express.Router();

// We will import the logic from the controller
const { 
    parseSourceCode, 
    transpileCode 
} = require('../controllers/optiController');

// Route 1: Parse code and return AST representation
router.post('/parse', parseSourceCode);

// Route 2: Send code to Gemini for transpilation/optimization
router.post('/transpile', transpileCode);

module.exports = router;