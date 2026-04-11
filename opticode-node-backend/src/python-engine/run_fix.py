import sys
import json
from ai_orchestrator import AIOrchestrator

def main():
    try:
        input_data = sys.stdin.read()
        request = json.loads(input_data)

        source_code = request.get('source_code')
        language = request.get('language')
        findings_summary = request.get('findings_summary', '')

        if not source_code or not language:
            raise ValueError("Missing 'source_code' or 'language' in input payload.")

        orchestrator = AIOrchestrator()
        fixed_code = orchestrator.fix_code(source_code, language, findings_summary)

        response = {
            "status": "success",
            "fixed_code": fixed_code
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
