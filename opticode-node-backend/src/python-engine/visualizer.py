import graphviz
from tree_sitter import Node

class ASTVisualizer:
    """
    Engine that takes a Tree-sitter AST, prunes the noise, and generates 
    a visual logic tree using Graphviz.
    """
    def __init__(self):
        # PRUNING LOGIC: We only draw these critical structural nodes
        self.important_node_types = {
            "function_definition", "class_definition", "for_statement", 
            "while_statement", "if_statement", "return_statement",
            "expression_statement", "declaration", "method_declaration",
            "binary_expression", "call_expression", "argument_list",
            "identifier", "number", "string", "translation_unit", "program"
        }

    def generate_pruned_tree(self, root_node: Node):
        """
        Traverses the AST and returns a Graphviz object WITHOUT saving to disk.
        """
        # Initialize a Graphviz Directed Graph
        dot = graphviz.Digraph(comment='Pruned Abstract Syntax Tree')
        dot.attr(rankdir='TB', dpi='300') 
        
        self.node_counter = 0
        
        # Start the recursive DFS traversal
        self._traverse_and_draw(root_node, dot, parent_id=None)
        
        # DO NOT RENDER/SAVE FILE. Just return the object.
        return dot

    def _traverse_and_draw(self, node: Node, dot: graphviz.Digraph, parent_id: str):
        """
        Recursive Depth-First Search to map tree nodes to Graphviz visual nodes.
        """
        # Decide if we draw this node or skip it to keep the tree clean
        is_important = node.type in self.important_node_types or node.is_named
        
        current_id = parent_id # If we skip this node, children connect to the grandparent

        if is_important:
            self.node_counter += 1
            current_id = str(self.node_counter)
            
            # Format the visual block
            label = f"{node.type}"
            dot.node(current_id, label, shape='box', style='filled', fillcolor='#e3f2fd', fontname='Arial')
            
            # Connect the block to its parent
            if parent_id is not None:
                dot.edge(parent_id, current_id)

        # Recursively visit all children
        for child in node.children:
            self._traverse_and_draw(child, dot, current_id)

# ==========================================
# TEST: Draw a C++ DSA Algorithm
# ==========================================
if __name__ == "__main__":
    from polyglot_parser import PolyglotEngine # Import the parser from Lecture 1
    
    engine = PolyglotEngine()
    
    # Let's test with a classic C++ Array max-finding algorithm
    cpp_code = """
    int find_max(int arr[], int n) {
        int max_val = arr[0];
        for(int i=1; i<n; i++) {
            if(arr[i] > max_val) {
                max_val = arr[i];
            }
        }
        return max_val;
    }
    """
    
    print("1. Parsing C++ code...")
    root = engine.parse_code(cpp_code, "cpp")
    
    print("2. Drawing Pruned AST...")
    visualizer = ASTVisualizer()
    visualizer.generate_pruned_tree(root, "cpp_ast_demo")