import sys
import json
from ai_orchestrator import AIOrchestrator

def main():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"status": "error", "error_message": "No input data provided."}))
            return

        data = json.loads(input_data)
        source_code = data.get("source_code")
        language = data.get("language")

        if not source_code or not language:
            print(json.dumps({"status": "error", "error_message": "Missing necessary fields (source_code, language)."}))
            return

        orchestrator = AIOrchestrator()
        review_json_str = orchestrator.review_code(source_code, language)

        try:
            # We parse the AI's string output to ensure it's valid JSON before passing back to Node
            review_obj = json.loads(review_json_str)
            print(json.dumps({
                "status": "success",
                "review_data": review_obj
            }))
        except json.JSONDecodeError:
            # If the LLM disobeyed and gave text, wrap it manually
            print(json.dumps({
                "status": "error",
                "error_message": "Failed to parse Gemini response as JSON.",
                "raw_response": review_json_str
            }))

    except Exception as e:
        print(json.dumps({"status": "error", "error_message": str(e)}))

if __name__ == "__main__":
    main()
