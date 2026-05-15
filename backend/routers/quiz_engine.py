from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(
    prefix="/quiz",
    tags=["Adaptive Quiz"]
)

# Comprehensive Subject Data
SUBJECTS = {
    "dynamic_websites": {
        "title": "Dynamic Websites",
        "modules": [
            "1.0 Introduction to the Module (6h)",
            "2.0 Designing and Coding a Website (8h)",
            "3.0 Design and Developing for Mobile Websites (6h)",
            "4.0 Design and Build a Database (1) (3h)"
        ],
        "content": "Dynamic websites are the backbone of modern internet... [Detailed technical content about frontend, backend, and DB integration]"
    },
    "software_engineering": {
        "title": "Software Engineering and Testing",
        "modules": [
            "1.0 Introduction to Software Engineering and Testing (8h)",
            "2.0 Testing Techniques (8h)",
            "3.0 Software Testing Life Cycle (6h)",
            "4.0 Defect Management (6h)"
        ],
        "content": "Software engineering is a systematic approach to the development, operation, and maintenance of software... [Detailed testing methodologies]"
    },
    "business_intelligence": {
        "title": "Business Intelligence",
        "modules": [
            "1.0 Business Intelligence an Introduction (6h)",
            "2.0 Business Intelligence Essentials (6h)",
            "3.0 Architecting the Data (9h)",
            "4.0 Data Extraction (7h)"
        ],
        "content": "Business Intelligence (BI) involves the strategies and technologies used by enterprises for data analysis... [ETL and Data Warehousing]"
    },
    "python_programming": {
        "title": "Python Programming",
        "modules": [
            "1.0 Introduction to Python (4h)",
            "2.0 Python Data types and operators (10h)",
            "3.0 Python Program Flow Control (6h)",
            "4.0 Python Functions, Modules and Packages (4h)"
        ],
        "content": "Python is an interpreted, high-level and general-purpose programming language. Its design philosophy emphasizes code readability with its use of significant indentation. Python is dynamically-typed and garbage-collected. It supports multiple programming paradigms, including structured (particularly procedural), object-oriented and functional programming."
    }
}

@router.get("/subjects")
def get_subjects():
    return SUBJECTS

@router.get("/subjects/{subject_id}/{level}")
def get_subject_content(subject_id: str, level: int):
    # Dynamic Level-Specific Content Generation
    base_title = SUBJECTS.get(subject_id, {}).get("title", "Topic")
    return {
        "title": f"{base_title} - Level {level}",
        "content": f"ADVANCED CONCEPTS FOR {base_title.upper()} (LEVEL {level})\n\n" + 
                   "In this advanced tier, we explore complex architectural patterns and optimization strategies. " +
                   f"Level {level} focuses on deep integration, security protocols, and performance tuning specifically for {base_title}. " +
                   "Mastering these concepts is essential for expert-level certification."
    }

@router.get("/generate/{subject_id}/{level}")
def generate_quiz(subject_id: str, level: int):
    # COMPREHENSIVE TECHNICAL QUESTION BANK
    BANK = {
        "python_programming": {
            1: [ # Introduction to Python (4h)
                {"q": "Who created Python?", "o": ["Guido van Rossum", "Elon Musk", "Bill Gates", "Mark Zuckerberg"], "a": 0},
                {"q": "What is the correct file extension for Python files?", "o": [".pyt", ".py", ".pt", ".python"], "a": 1},
                {"q": "Python is a ___ level language.", "o": ["Low", "Middle", "High", "Machine"], "a": 2},
                {"q": "Is indentation mandatory in Python?", "o": ["No", "Yes", "Only for classes", "Only for strings"], "a": 1},
                {"q": "Which of these is used to display output?", "o": ["echo", "print()", "printf", "console.log"], "a": 1}
            ],
            2: [ # Python Data types and operators (10h)
                {"q": "Which of these is NOT a numeric type?", "o": ["int", "float", "complex", "list"], "a": 3},
                {"q": "What is the output of 10 // 3?", "o": ["3.33", "3", "4", "3.0"], "a": 1},
                {"q": "Which operator is used for power (x to the power y)?", "o": ["^", "**", "*", "pow"], "a": 1},
                {"q": "What is the type of 'True'?", "o": ["string", "bool", "int", "None"], "a": 1},
                {"q": "How do you add an element to a list?", "o": ["append()", "add()", "insert()", "Both append and insert"], "a": 3}
            ],
            3: [ # Python Program Flow Control (6h)
                {"q": "Which statement is used for a multi-way branch?", "o": ["if-else", "switch", "elif", "case"], "a": 2},
                {"q": "What is used to iterate over a sequence?", "o": ["while", "for", "do-while", "if"], "a": 1},
                {"q": "Which keyword skips the current iteration?", "o": ["break", "stop", "continue", "pass"], "a": 2},
                {"q": "What does 'pass' do?", "o": ["Exits the program", "Does nothing (placeholder)", "Skips error", "Returns True"], "a": 1}
            ],
            4: [ # Python Functions, Modules and Packages (4h)
                {"q": "How to define a function?", "o": ["def name():", "function name():", "define name():", "void name():"], "a": 0},
                {"q": "How to import a module?", "o": ["use math", "include math", "import math", "get math"], "a": 2},
                {"q": "What is __init__.py used for?", "o": ["Initialize a variable", "Mark a directory as a package", "Start the program", "Clean memory"], "a": 1}
            ]
        },
        "dynamic_websites": {
            1: [
                {"q": "What does HTML stand for?", "o": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Management", "Home Tool Markup"], "a": 0},
                {"q": "Which tag is used for the largest heading?", "o": ["<h6>", "<head>", "<h1>", "<header>"], "a": 2},
                {"q": "What is the correct CSS syntax?", "o": ["{body;color:black;}", "body:color=black;", "body {color: black;}", "{body:color=black;}"], "a": 2},
                {"q": "How do you call a function in JS?", "o": ["call myFunc()", "myFunc()", "call function myFunc()", "execute myFunc()"], "a": 1},
                {"q": "Which property changes text color?", "o": ["text-color", "color", "font-style", "fg-color"], "a": 1}
            ],
            2: [
                {"q": "Which attribute defines inline styles?", "o": ["class", "styles", "style", "font"], "a": 2},
                {"q": "How to make a list with bullets?", "o": ["<ul>", "<ol>", "<list>", "<dl>"], "a": 0},
                {"q": "Which JS event occurs on a click?", "o": ["onmouseclick", "onclick", "onchange", "onpress"], "a": 1},
                {"q": "What is the purpose of 'box-sizing'?", "o": ["Set box shadow", "Include padding/border in width", "Resize elements", "Animate boxes"], "a": 1},
                {"q": "How to select ID 'demo' in CSS?", "o": [".demo", "#demo", "demo", "*demo"], "a": 1}
            ]
        },
        "software_engineering": {
            1: [
                {"q": "What is the first phase of SDLC?", "o": ["Testing", "Requirement Analysis", "Design", "Implementation"], "a": 1},
                {"q": "What does CASE stand for?", "o": ["Computer Aided Software Engineering", "Control Access Software Engine", "Code Analysis System", "Common Application Setup"], "a": 0},
                {"q": "Which model is the oldest SDLC?", "o": ["Spiral", "Agile", "Waterfall", "V-Model"], "a": 2},
                {"q": "What is Black Box Testing?", "o": ["Testing internals", "Testing functionality without code access", "Performance testing", "Load testing"], "a": 1},
                {"q": "What is a Bug?", "o": ["An insect", "An error in software", "A hardware failure", "A feature"], "a": 1}
            ],
            2: [
                {"q": "What is Regression Testing?", "o": ["Testing new features", "Testing existing features after changes", "User testing", "Speed testing"], "a": 1},
                {"q": "What is a Sprint in Agile?", "o": ["A race", "A short, timed work period", "A meeting", "A document"], "a": 1},
                {"q": "Which is a Non-functional requirement?", "o": ["User login", "Performance", "Data entry", "Report generation"], "a": 1},
                {"q": "What is a Unit Test?", "o": ["Testing the whole app", "Testing individual components", "Testing UI", "Testing DB"], "a": 1},
                {"q": "What is the goal of Refactoring?", "o": ["Adding features", "Improving code structure without changing behavior", "Fixing bugs", "Deleting code"], "a": 1}
            ]
        },
        "business_intelligence": {
            1: [
                {"q": "What is BI?", "o": ["Business Info", "Business Intelligence", "Basic Info", "Basic Intelligence"], "a": 1},
                {"q": "What is the primary goal of BI?", "o": ["Marketing", "Decision Making", "Coding", "Security"], "a": 1},
                {"q": "Which tool is used for BI?", "o": ["Word", "PowerBI", "Notepad", "Paint"], "a": 1},
                {"q": "What does ETL stand for?", "o": ["Eat Talk Listen", "Extract Transform Load", "Exit Top Level", "Enter Total List"], "a": 1},
                {"q": "What is a Dashboard?", "o": ["A car part", "A visual display of data", "A database", "A spreadsheet"], "a": 1}
            ],
            2: [
                {"q": "What is a Data Warehouse?", "o": ["A storage for old files", "A central repository for integrated data", "A server room", "A backup system"], "a": 1},
                {"q": "What is Data Mining?", "o": ["Extracting minerals", "Discovering patterns in large datasets", "Writing code", "Building databases"], "a": 1},
                {"q": "What does OLAP stand for?", "o": ["Online Analytical Processing", "On-Line Application Platform", "Open Layer Access Protocol", "Outer Link Analytical Part"], "a": 0},
                {"q": "What is a KPI?", "o": ["Key Performance Indicator", "Key Project Info", "Knowledge Process Index", "Key Person Interest"], "a": 0},
                {"q": "What is Data Visualization?", "o": ["Making data invisible", "Representing data graphically", "Encrypting data", "Deleting data"], "a": 1}
            ]
        }
    }
    
    # Get questions for subject and level, fallback to python if not in bank
    subject_bank = BANK.get(subject_id, BANK["python_programming"]) 
    lvl_questions = subject_bank.get(level, subject_bank.get(1, []))
    
    formatted = []
    for i, q in enumerate(lvl_questions):
        formatted.append({
            "id": i + 1,
            "question": q["q"],
            "options": q["o"],
            "answer": q["a"]
        })
    return formatted
