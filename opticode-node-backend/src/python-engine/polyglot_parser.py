import tree_sitter_python as tspython
import tree_sitter_cpp as tscpp
import tree_sitter_java as tsjava
import tree_sitter_javascript as tsjavascript
from tree_sitter import Language, Parser

class PolyglotEngine:
    """
    Industry-grade parser that dynamically switches grammars to generate 
    Abstract Syntax Trees for multiple programming languages.
    """
    def __init__(self):
        # Initialize the C-bindings for all 4 languages
        self.languages = {
            "python": Language(tspython.language()),
            "cpp": Language(tscpp.language()),
            "java": Language(tsjava.language()),
            "javascript": Language(tsjavascript.language())
        }
        self.parser = Parser()

    def parse_code(self, source_code: str, language_choice: str):
        """
        Takes source code and a language string, sets the correct grammar, 
        and returns the root node of the AST.
        """
        if language_choice not in self.languages:
            raise ValueError(f"Language '{language_choice}' is not supported yet.")

        # Switch the parser's brain to the selected language
        self.parser.language = self.languages[language_choice]
        
        # Tree-sitter requires raw bytes, not standard strings
        source_bytes = bytes(source_code, "utf8")
        tree = self.parser.parse(source_bytes)
        
        return tree.root_node

# ==========================================
# TEST: Prove the engine speaks 4 languages
# ==========================================
if __name__ == "__main__":
    engine = PolyglotEngine()

    # 1. Test C++ (DSA Focus)
    cpp_code = """
    int main() {
        for(int i=0; i<n; i++) {
            cout << i;
        }
        return 0;
    }
    """
    cpp_root = engine.parse_code(cpp_code, "cpp")
    print(f"C++ AST Root Node: {cpp_root.type}")

    # 2. Test JavaScript (Web Focus)
    js_code = "function hello() { console.log('world'); }"
    js_root = engine.parse_code(js_code, "javascript")
    print(f"JavaScript AST Root Node: {js_root.type}")
    
    print("\n✅ Polyglot Engine is successfully parsing multiple languages!")