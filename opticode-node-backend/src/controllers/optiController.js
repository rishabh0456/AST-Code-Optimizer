const { spawn } = require('child_process');
const path = require('path');

const runPythonScript = (scriptName, data) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../python-engine', scriptName);
        
        const pythonProcess = spawn('python', [scriptPath]);

        let outputData = '';
        let errorData = '';

        pythonProcess.stdin.write(JSON.stringify(data));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (chunk) => {
            outputData += chunk.toString();
        });

        pythonProcess.stderr.on('data', (chunk) => {
            errorData += chunk.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Python Error: ${errorData || 'Unknown execution failure'}`));
            }
            try {
                const parsedOutput = JSON.parse(outputData);
                resolve(parsedOutput);
            } catch (err) {
                reject(new Error('Failed to parse Python output as JSON.'));
            }
        });
    });
};

// Parse Source Code Route
const parseSourceCode = async (req, res) => {
    try {
        const { sourceCode, language } = req.body;
        
        if (!sourceCode || !language) {
            return res.status(400).json({ error: 'Source code and language are required.' });
        }

        const pyData = { source_code: sourceCode, language: language };
        const result = await runPythonScript('run_parser.py', pyData);

        if (result.status === 'error') {
            return res.status(500).json({ error: result.error_message });
        }

        res.status(200).json({ 
            message: 'AST generated successfully.',
            ast_data: result.ast_dot_source 
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to process code through Polyglot Engine.', details: error.message });
    }
};

// Transpile Code Route 
const transpileCode = async (req, res) => {
    try {
        const { sourceCode, sourceLang, targetLang, customInstructions } = req.body;

        if (!sourceCode || !sourceLang || !targetLang) {
            return res.status(400).json({ 
                error: 'Missing required parameters. Need sourceCode, sourceLang, and targetLang.' 
            });
        }

        const pyData = { 
            source_code: sourceCode, 
            source_lang: sourceLang,
            target_lang: targetLang,
            custom_instructions: customInstructions || ""
        };
        
        const result = await runPythonScript('run_ai.py', pyData);

        if (result.status === 'error') {
            return res.status(500).json({ error: result.error_message });
        }

        res.status(200).json({ 
            message: 'Transpilation complete.',
            optimized_result: result.optimized_code_markdown 
        });

    } catch (error) {
        res.status(500).json({ 
            error: 'AI Transpilation failed due to a server error.', 
            details: error.message 
        });
    }
};

module.exports = {
    parseSourceCode,
    transpileCode
};