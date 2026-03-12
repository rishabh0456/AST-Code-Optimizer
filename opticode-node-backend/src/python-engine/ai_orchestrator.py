import google.generativeai as genai
import os

class AIOrchestrator:
    """
    Expert AI Engine for OptiCode: Provides structured theoretical 
    analysis, complexity comparison, and multi-language optimization.
    """
    def __init__(self):
        # Fetch the key securely from environment variables
        api_key = os.environ.get("GEMINI_API_KEY")
        
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing.")

        # Configure the API with your secure key
        genai.configure(api_key=api_key)
        
        # 1. Ask Google what models your key actually owns
        available_models = []
        try:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    available_models.append(m.name.replace('models/', ''))
        except Exception:
            # Fallback if listing fails
            available_models = ['gemini-1.5-flash']

        # 2. Dynamically pick the best available model (Priority: Gemini 3/2.5/1.5)
        if 'gemini-3.1-pro' in available_models:
            chosen_model = 'gemini-3.1-pro'
        elif 'gemini-3-flash' in available_models:
            chosen_model = 'gemini-3-flash'
        elif 'gemini-2.5-flash' in available_models:
            chosen_model = 'gemini-2.5-flash'
        elif 'gemini-1.5-flash' in available_models:
            chosen_model = 'gemini-1.5-flash'
        else:
            chosen_model = available_models[0]
            
        self.model = genai.GenerativeModel(chosen_model)

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
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"❌ AI Transformation Failed: {str(e)}"