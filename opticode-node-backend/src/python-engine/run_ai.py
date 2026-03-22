import sys
import json
from ai_orchestrator import AIOrchestrator

def main():
    try:
        input_data = sys.stdin.read()
        
        if not input_data:
             raise ValueError("No data received from Node.")
             
        request = json.loads(input_data)
        
        source_code = request.get('source_code')
        source_lang = request.get('source_lang')
        target_lang = request.get('target_lang')
        custom_instructions = request.get('custom_instructions', '')

        if not all([source_code, source_lang, target_lang]):
            raise ValueError("Missing required fields: source_code, source_lang, or target_lang.")

        ai_engine = AIOrchestrator()

        result_markdown = ai_engine.optimize_code(
            source_code=source_code,
            source_lang=source_lang,
            target_lang=target_lang,
            custom_instructions=custom_instructions
        )

        response = {
            "status": "success",
            "optimized_code_markdown": result_markdown
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