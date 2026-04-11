import sys
import json
import graphviz
from polyglot_parser import PolyglotEngine


# Map of AST node types to human-friendly categories
LOGIC_NODES = {
    # Functions & Classes
    "function_definition": ("Function", "#6366f1", "box3d"),
    "function_declaration": ("Function", "#6366f1", "box3d"),
    "method_declaration": ("Method", "#6366f1", "box3d"),
    "class_definition": ("Class", "#ec4899", "component"),
    "class_declaration": ("Class", "#ec4899", "component"),
    
    # Control Flow
    "if_statement": ("If", "#f59e0b", "diamond"),
    "else_clause": ("Else", "#fb923c", "diamond"),
    "elif_clause": ("Else If", "#fbbf24", "diamond"),
    "switch_statement": ("Switch", "#f59e0b", "diamond"),
    "case_statement": ("Case", "#fbbf24", "diamond"),
    
    # Loops
    "for_statement": ("For Loop", "#10b981", "hexagon"),
    "for_range_loop": ("For Each", "#10b981", "hexagon"),
    "while_statement": ("While Loop", "#10b981", "hexagon"),
    "do_statement": ("Do-While", "#10b981", "hexagon"),
    "enhanced_for_statement": ("For Each", "#10b981", "hexagon"),
    
    # Returns & Flow
    "return_statement": ("Return", "#ef4444", "parallelogram"),
    "break_statement": ("Break", "#ef4444", "ellipse"),
    "continue_statement": ("Continue", "#f97316", "ellipse"),
    
    # Calls
    "call_expression": ("Call", "#3b82f6", "rounded"),
    
    # Declarations & Assignments
    "declaration": ("Declare", "#8b5cf6", "box"),
    "init_declarator": ("Initialize", "#8b5cf6", "box"),
    "assignment_expression": ("Assign", "#8b5cf6", "box"),
    "expression_statement": None,  # We'll check children
}


def extract_text(node, source_bytes, max_len=40):
    """Extract human readable text from a node, truncated."""
    text = source_bytes[node.start_byte:node.end_byte].decode('utf8', errors='replace').strip()
    # Remove newlines and excessive whitespace
    text = ' '.join(text.split())
    if len(text) > max_len:
        text = text[:max_len] + "…"
    return text


def get_identifier_name(node, source_bytes):
    """Recursively find the first identifier/name child."""
    if node.type in ("identifier", "name"):
        return source_bytes[node.start_byte:node.end_byte].decode('utf8')
    for c in node.children:
        res = get_identifier_name(c, source_bytes)
        if res:
            return res
    return ""


def get_condition_text(node, source_bytes):
    """Extract the condition part from if/while/for statements."""
    for child in node.children:
        if child.type in ("condition_clause", "parenthesized_expression"):
            return extract_text(child, source_bytes, 50)
        # For Python-style: if <condition>:
        if child.type == "comparison_operator" or child.type == "binary_expression":
            return extract_text(child, source_bytes, 50)
    return ""


def build_logic_graph(root_node, source_bytes):
    """
    Walk the AST and produce a simplified logic flow graph.
    Only picks up meaningful constructs and labels them in plain English.
    """
    dot = graphviz.Digraph(comment='Simplified Logic Flow')
    dot.attr(
        rankdir='TB', dpi='150', bgcolor='transparent',
        fontname='Arial', fontsize='12',
        nodesep='0.6', ranksep='0.8'
    )
    dot.attr('node', fontname='Arial', fontsize='11', style='filled,rounded', penwidth='1.5')
    dot.attr('edge', color='#64748b', arrowsize='0.7', penwidth='1.2')

    counter = [0]

    def next_id():
        counter[0] += 1
        return f"n{counter[0]}"

    def traverse(node, parent_id=None):
        node_type = node.type
        
        # Skip non-meaningful wrapper nodes
        if node_type in ("translation_unit", "program", "module"):
            for child in node.children:
                traverse(child, parent_id)
            return

        entry = LOGIC_NODES.get(node_type)

        if entry is not None:
            label_prefix, color, shape = entry
            nid = next_id()

            # Build a human-readable label
            if node_type in ("function_definition", "function_declaration", "method_declaration"):
                name = get_identifier_name(node, source_bytes)
                label = f"🔧 Function: {name}()" if name else f"🔧 {label_prefix}"
                
            elif node_type in ("class_definition", "class_declaration"):
                name = get_identifier_name(node, source_bytes)
                label = f"📦 Class: {name}" if name else f"📦 {label_prefix}"

            elif node_type in ("if_statement", "elif_clause"):
                cond = get_condition_text(node, source_bytes)
                label = f"❓ {label_prefix}: {cond}" if cond else f"❓ {label_prefix}"

            elif node_type == "else_clause":
                label = "↪ Else"

            elif node_type in ("for_statement", "for_range_loop", "while_statement", 
                               "do_statement", "enhanced_for_statement"):
                cond = get_condition_text(node, source_bytes)
                label = f"🔄 {label_prefix}: {cond}" if cond else f"🔄 {label_prefix}"

            elif node_type == "return_statement":
                ret_text = extract_text(node, source_bytes, 30)
                # Clean up "return" keyword from the text
                ret_text = ret_text.replace("return ", "").replace("return", "").strip()
                label = f"⏎ Return: {ret_text}" if ret_text else "⏎ Return"

            elif node_type == "call_expression":
                name = get_identifier_name(node, source_bytes)
                label = f"📞 Call: {name}()" if name else f"📞 Call"

            elif node_type in ("declaration", "init_declarator"):
                text = extract_text(node, source_bytes, 35)
                label = f"📝 {label_prefix}: {text}"

            elif node_type in ("break_statement",):
                label = "🛑 Break"

            elif node_type in ("continue_statement",):
                label = "⏭ Continue"

            else:
                label = f"{label_prefix}"

            # Escape special graphviz characters
            label = label.replace('"', '\\"').replace('<', '\\<').replace('>', '\\>')

            dot.node(nid, label, shape=shape if shape != "rounded" else "box",
                     fillcolor=f"{color}22", color=color, fontcolor='#e2e8f0')

            if parent_id:
                dot.edge(parent_id, nid)

            # Recurse into children with this node as parent
            for child in node.children:
                traverse(child, nid)
        else:
            # Not a logic node — pass through to children keeping parent_id
            for child in node.children:
                traverse(child, parent_id)

    traverse(root_node, None)
    return dot


def main():
    try:
        input_data = sys.stdin.read()
        request = json.loads(input_data)

        source_code = request.get('source_code')
        language = request.get('language')

        if not source_code or not language:
            raise ValueError("Missing 'source_code' or 'language' in input payload.")

        engine = PolyglotEngine()
        root = engine.parse_code(source_code, language)
        source_bytes = bytes(source_code, "utf8")

        dot = build_logic_graph(root, source_bytes)

        response = {
            "status": "success",
            "logic_flow_dot": dot.source
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
