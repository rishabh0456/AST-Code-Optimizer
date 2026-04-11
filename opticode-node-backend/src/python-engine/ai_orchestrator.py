import google.generativeai as genai
import os
import time
import sys

class AIOrchestrator:
    """
    Expert AI Engine for OptiCode: Provides structured theoretical 
    analysis, complexity comparison, and multi-language optimization.
    
    Uses an automatic model fallback system — if one model's quota is
    exhausted, it seamlessly tries the next available model.
    """
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing.")

        genai.configure(api_key=api_key)
        
        # Build a list of ALL available models we can try, in preference order
        available_models = []
        try:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    available_models.append(m.name.replace('models/', ''))
        except Exception:
            available_models = []

        # Order: try lite/cheap models first (they have separate quota buckets)
        preferred_order = [
            'gemini-2.0-flash-lite',
            'gemini-2.0-flash-lite-001',
            'gemini-2.0-flash',
            'gemini-2.0-flash-001',
            'gemini-2.5-flash',
            'gemini-2.5-pro',
        ]
        
        self.model_chain = []
        for pref in preferred_order:
            if pref in available_models:
                self.model_chain.append(pref)
        
        # Add any remaining models we haven't listed, as last-resort fallbacks
        for m in available_models:
            if m not in self.model_chain and 'gemma' not in m and 'tts' not in m:
                self.model_chain.append(m)
        
        if not self.model_chain:
            self.model_chain = ['gemini-2.0-flash-lite']
        
        # Log to stderr so we can debug which models are available
        print(f"[OptiCode] Model chain: {self.model_chain}", file=sys.stderr)

    def _call_with_fallback(self, prompt: str) -> str:
        """
        Core method: tries each model in the chain until one succeeds.
        If a model returns 429/quota error, immediately skips to the next model
        instead of wasting time retrying.
        """
        last_error = None
        
        for model_name in self.model_chain:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                return response.text
            except Exception as e:
                err_msg = str(e).lower()
                last_error = e
                if "429" in err_msg or "quota" in err_msg or "resource" in err_msg:
                    # This model's quota is exhausted, try next model immediately
                    print(f"[OptiCode] Model '{model_name}' quota exhausted, trying next...", file=sys.stderr)
                    continue
                elif "404" in err_msg or "not found" in err_msg:
                    # Model doesn't exist on this API version, skip it
                    print(f"[OptiCode] Model '{model_name}' not found, trying next...", file=sys.stderr)
                    continue
                else:
                    # Some other error (network, invalid request, etc.) — raise it
                    raise e
        
        # All models exhausted
        raise last_error if last_error else Exception("No available Gemini models found.")

    def optimize_code(self, source_code: str, source_lang: str, target_lang: str, custom_instructions: str) -> str:
        """
        Takes the source AST logic and converts/optimizes it into the target language 
        based on specific client instructions.
        """
        prompt = f"""
        System: You are an Expert Polyglot Engineer and Compiler Design Specialist.
        
        TASK:
        Convert and optimize the provided {source_lang.upper()} code into {target_lang.upper()}.
        The optimization must focus on improving Time Complexity (O(N^2) -> O(N)) and Space Efficiency.
        
        CRITICAL RULE:
        The optimized {target_lang.upper()} implementation MUST NOT contain any comments whatsoever (no single-line, multi-line, or docstring comments). Output pure code only.
        
        CLIENT CUSTOM INSTRUCTIONS:
        {custom_instructions if custom_instructions else "Follow standard best practices for the target language."}
        
        OUTPUT FORMAT:
        1. ### Algorithmic Analysis (Briefly explain the logic change)
        2. ### Optimized {target_lang.upper()} Implementation (Inside a code block)
        
        SOURCE CODE:
        ```{source_lang}
        {source_code}
        ```
        """
        try:
            return self._call_with_fallback(prompt)
        except Exception as e:
            return f"❌ AI Transformation Failed: {str(e)}"

    def review_code(self, source_code: str, language: str) -> str:
        """
        Acts as an automated senior reviewer.
        Ensures strictly formatted JSON output mapping to the frontend schema.
        """
        prompt = f"""
        System: You are a Senior Security and Performance Code Reviewer.
        
        TASK:
        Review the following {language.upper()} code for Bugs, Security, Performance, Code Style, and Best Practices.
        
        OUTPUT FORMAT (CRITICAL):
        You MUST return ONLY valid JSON. Absolutely no markdown blocks, no code fences (do not wrap in ```json), no chat text. Just the raw JSON object.
        
        SCHEMA:
        {{
            "score": <number between 0 and 100>,
            "findings": [
                {{
                    "category": "<Must be exactly one of: 'Bugs', 'Security', 'Performance', 'Style', 'Best Practices'>",
                    "severity": "<Must be exactly one of: 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'>",
                    "lines": [<array of integer line numbers affected>],
                    "title": "<Short string>",
                    "description": "<Detailed string describing issue>",
                    "suggestedFix": "<Code string showing how to fix it>"
                }}
            ]
        }}
        
        SOURCE CODE TO REVIEW:
        {source_code}
        """
        try:
            text = self._call_with_fallback(prompt)
            # Strip markdown fences if Gemini still injects them
            text = text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            return text.strip()
        except Exception as e:
            return '{"score": 0, "findings": [{"category": "Bugs", "severity": "CRITICAL", "lines": [0], "title": "AI Error", "description": "' + str(e).replace('"', "'") + '", "suggestedFix": "N/A"}]}'

    def fix_code(self, source_code: str, language: str, findings_summary: str) -> str:
        """
        Takes the source code and the review findings, and returns a fully fixed version of the code.
        """
        prompt = f"""
        System: You are an Expert {language.upper()} Developer and Code Fixer.
        
        TASK:
        Fix ALL the issues listed below in the provided {language.upper()} source code.
        Apply every fix carefully while preserving the original logic and intent of the code.
        
        ISSUES TO FIX:
        {findings_summary}
        
        OUTPUT FORMAT:
        Return ONLY the complete fixed source code inside a single code block. 
        Do NOT include any explanation, commentary or notes — just the fixed code.
        
        ORIGINAL SOURCE CODE:
        ```{language}
        {source_code}
        ```
        """
        try:
            result = self._call_with_fallback(prompt)
            return result
        except Exception as e:
            return f"❌ AI Fix Failed: {str(e)}"

    def analyze_algorithm(self, source_code: str, language: str) -> str:
        """
        Provides a human-readable algorithm analysis — time complexity,
        space complexity, approach, and optimization suggestions.
        """
        prompt = f"""
        System: You are a Senior Algorithm Analyst and Computer Science Professor.
        
        TASK:
        Analyze the following {language.upper()} code and provide a clear, structured analysis.
        
        OUTPUT FORMAT (Use markdown):
        ### 🧠 Algorithm Overview
        Briefly describe what the code does in plain English.
        
        ### ⏱ Time Complexity
        State the time complexity (e.g., O(N), O(N²)) with a brief justification.
        
        ### 💾 Space Complexity
        State the space complexity with justification.
        
        ### 📊 Approach
        What algorithmic approach is used? (e.g., brute force, divide & conquer, dynamic programming, greedy, etc.)
        
        ### 💡 Optimization Suggestions
        Briefly suggest if the code can be optimized further, and how.
        
        SOURCE CODE:
        ```{language}
        {source_code}
        ```
        """
        try:
            return self._call_with_fallback(prompt)
        except Exception as e:
            return f"❌ Algorithm Analysis Failed: {str(e)}"