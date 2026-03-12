# src/python-engine/run_parser.py
import sys
import json
from polyglot_parser import PolyglotEngine
from visualizer import ASTVisualizer

def main():
    try:
        # 1. Read the input passed from Node.js (via stdin)
        input_data = sys.stdin.read()
        request = json.loads(input_data)
        
        source_code = request.get('source_code')
        language = request.get('language')

        if not source_code or not language:
            raise ValueError("Missing 'source_code' or 'language' in input payload.")

        # 2. Initialize your core engine
        engine = PolyglotEngine()
        visualizer = ASTVisualizer()

        # 3. Parse and generate the logic tree
        root = engine.parse_code(source_code, language)
        dot_graph = visualizer.generate_pruned_tree(root)

        # 4. Return the raw Graphviz source back to Node.js (via stdout)
        response = {
            "status": "success",
            "ast_dot_source": dot_graph.source
        }
        
        # This print statement is what Node.js reads!
        print(json.dumps(response))
        sys.exit(0)

    except Exception as e:
        error_response = {
            "status": "error",
            "error_message": str(e)
        }
        # Print error formatted as JSON so Node can catch it cleanly
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main()