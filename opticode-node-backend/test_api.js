const testParse = async () => {
    console.log("🟡 Testing Parser Endpoint...");
    try {
        const response = await fetch('http://localhost:3000/api/v1/opticode/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sourceCode: "int main() { return 0; }",
                language: "cpp"
            })
        });
        const data = await response.json();
        console.log("✅ Parser Result:", data.message);
        if(data.ast_data) console.log("   AST Graphviz payload received successfully.\n");
    } catch (err) {
        console.error("❌ Parser Test Failed:", err.message);
    }
};

const testAI = async () => {
    console.log("🟡 Testing AI Transpilation Endpoint...");
    try {
        const response = await fetch('http://localhost:3000/api/v1/opticode/transpile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sourceCode: "int main() { return 0; }",
                sourceLang: "cpp",
                targetLang: "python",
                apiKey: "AIzaSyD-c24zbbiNjQWzTIxcRREnO2bftcITcwg" 
            })
        });
        const data = await response.json();
        console.log("✅ AI Result:", data.message);
        if(data.optimized_result) console.log("   AI Markdown payload received successfully.\n");
    } catch (err) {
        console.error("❌ AI Test Failed:", err.message);
    }
};

const runTests = async () => {
    await testParse();
    await testAI();
};

runTests();