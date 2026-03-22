import sys
import json
from polyglot_parser import PolyglotEngine
from visualizer import ASTVisualizer

def main():
    try:
        input_data = sys.stdin.read()
        request = json.loads(input_data)
        
        source_code = request.get('source_code')
        language = request.get('language')

        if not source_code or not language:
            raise ValueError("Missing 'source_code' or 'language' in input payload.")

        engine = PolyglotEngine()
        visualizer = ASTVisualizer()

        root = engine.parse_code(source_code, language)
        dot_graph = visualizer.generate_pruned_tree(root)

        response = {
            "status": "success",
            "ast_dot_source": dot_graph.source
        }
        
        print(json.dumps(response))
        sys.exit(0)

    except Exception as e:
        error_response = {
            "status": "error",
            "error_message": str(e)
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main()