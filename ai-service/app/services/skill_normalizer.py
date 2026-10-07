"""
Deterministic Multilingual Skill Normalization Service.
Maps diverse synonyms, aliases, casing variants, cross-language official labels (ESCO, Hindi, German, French, Spanish),
and abbreviations to standard canonical skills and categories while preserving Unicode integrity.
"""

import unicodedata
from typing import Dict, Tuple, Optional
from app.services.language_detector import detect_language

# Canonical skills with category
CANONICAL_SKILLS: Dict[str, str] = {
    # Programming Languages
    "JavaScript": "Programming",
    "TypeScript": "Programming",
    "Python": "Programming",
    "Java": "Programming",
    "C++": "Programming",
    "C#": "Programming",
    "C": "Programming",
    "Go": "Programming",
    "Rust": "Programming",
    "PHP": "Programming",
    "Ruby": "Programming",
    "Kotlin": "Programming",
    "Swift": "Programming",
    "Scala": "Programming",
    "R": "Programming",
    "Dart": "Programming",
    "SQL": "Database",
    "SQL Server": "Database",
    "Software Development": "Programming",

    # Frontend
    "React.js": "Frontend",
    "React Native": "Mobile",
    "Next.js": "Frontend",
    "Vue.js": "Frontend",
    "Angular": "Frontend",
    "HTML5": "Frontend",
    "CSS3": "Frontend",
    "Tailwind CSS": "Frontend",
    "Sass": "Frontend",
    "Redux": "Frontend",
    "Svelte": "Frontend",

    # Backend & Frameworks
    "Node.js": "Backend",
    "Express.js": "Backend",
    "NestJS": "Backend",
    "Django": "Backend",
    "Flask": "Backend",
    "FastAPI": "Backend",
    "Spring Boot": "Backend",
    "Spring": "Backend",
    "ASP.NET Core": "Backend",
    "Ruby on Rails": "Backend",
    "GraphQL": "Backend",
    "REST APIs": "Backend",
    "gRPC": "Backend",

    # Databases & Storage
    "PostgreSQL": "Database",
    "MySQL": "Database",
    "MongoDB": "Database",
    "Redis": "Database",
    "Elasticsearch": "Database",
    "DynamoDB": "Database",
    "Cassandra": "Database",
    "SQLite": "Database",
    "Oracle Database": "Database",

    # Cloud & DevOps
    "AWS Cloud": "Cloud",
    "Google Cloud": "Cloud",
    "Microsoft Azure": "Cloud",
    "Docker": "DevOps",
    "Kubernetes": "DevOps",
    "Terraform": "DevOps",
    "CI/CD Pipelines": "DevOps",
    "Ansible": "DevOps",
    "Linux": "DevOps",
    "Git": "DevOps",
    "GitHub Actions": "DevOps",

    # System Architecture & Messaging
    "System Architecture": "Architecture",
    "Microservices": "Architecture",
    "Apache Kafka": "Architecture",
    "RabbitMQ": "Architecture",
    "Event-Driven Architecture": "Architecture",
    "Distributed Systems": "Architecture",

    # Core Computer Science
    "Data Structures": "Core CS",
    "Algorithms": "Core CS",
    "Design Patterns": "Core CS",
    "Object-Oriented Programming": "Core CS",

    # AI, Data & Analytics
    "Machine Learning": "Data & AI",
    "Deep Learning": "Data & AI",
    "Natural Language Processing": "Data & AI",
    "PyTorch": "Data & AI",
    "TensorFlow": "Data & AI",
    "Scikit-Learn": "Data & AI",
    "Pandas": "Data & AI",
    "NumPy": "Data & AI",
    "Data Analysis": "Data & AI",
    "Data Engineering": "Data & AI",
    "Apache Spark": "Data & AI",

    # Practices & Soft Skills / Management
    "Project Management": "Practices",
    "Product Management": "Practices",
    "Agile Methodology": "Practices",
    "Scrum": "Practices",
    "Test-Driven Development": "Practices",
    "Team Leadership": "Leadership",
    "Communication": "Soft Skills",
    "Problem Solving": "Soft Skills",
}

# Synonyms & alias mapping (case-insensitive lookup key -> Canonical Name)
SYNONYM_MAP: Dict[str, str] = {
    # JavaScript
    "javascript": "JavaScript",
    "js": "JavaScript",
    "vanilla js": "JavaScript",
    "es6": "JavaScript",
    "es6+": "JavaScript",
    "ecmascript": "JavaScript",

    # TypeScript
    "typescript": "TypeScript",
    "ts": "TypeScript",

    # React vs React Native (Hard Negative protection)
    "react": "React.js",
    "react.js": "React.js",
    "reactjs": "React.js",
    "react js": "React.js",
    "react native": "React Native",
    "reactnative": "React Native",

    # Next.js
    "next": "Next.js",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "next js": "Next.js",

    # Vue
    "vue": "Vue.js",
    "vue.js": "Vue.js",
    "vuejs": "Vue.js",
    "vue js": "Vue.js",

    # Angular
    "angular": "Angular",
    "angularjs": "Angular",
    "angular 2+": "Angular",

    # CSS & Styling
    "html": "HTML5",
    "html5": "HTML5",
    "css": "CSS3",
    "css3": "CSS3",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "tailwind css": "Tailwind CSS",
    "sass": "Sass",
    "scss": "Sass",

    # Node.js
    "node": "Node.js",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "node js": "Node.js",

    # Express
    "express": "Express.js",
    "express.js": "Express.js",
    "expressjs": "Express.js",
    "express js": "Express.js",

    # NestJS
    "nestjs": "NestJS",
    "nest.js": "NestJS",
    "nest js": "NestJS",

    # Python
    "python": "Python",
    "python3": "Python",
    "py": "Python",

    # Django / Flask / FastAPI
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "fast api": "FastAPI",

    # Java & Spring / Spring Boot (Hard Negative protection)
    "java": "Java",
    "core java": "Java",
    "java 8": "Java",
    "java 11": "Java",
    "java 17": "Java",
    "spring": "Spring",
    "spring framework": "Spring",
    "spring boot": "Spring Boot",
    "springboot": "Spring Boot",

    # C# / .NET
    "c#": "C#",
    "csharp": "C#",
    "c sharp": "C#",
    ".net": "ASP.NET Core",
    "dotnet": "ASP.NET Core",
    "asp.net": "ASP.NET Core",
    "asp.net core": "ASP.NET Core",

    # C++
    "c++": "C++",
    "cpp": "C++",
    "c plus plus": "C++",

    # Go
    "go": "Go",
    "golang": "Go",
    "go language": "Go",

    # Rust
    "rust": "Rust",
    "rustlang": "Rust",

    # PHP
    "php": "PHP",
    "laravel": "PHP",

    # Ruby
    "ruby": "Ruby",
    "rails": "Ruby on Rails",
    "ruby on rails": "Ruby on Rails",

    # Databases & SQL vs SQL Server (Hard Negative protection)
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "psql": "PostgreSQL",
    "mysql": "MySQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "elastic": "Elasticsearch",
    "elasticsearch": "Elasticsearch",
    "sqlite": "SQLite",
    "dynamo": "DynamoDB",
    "dynamodb": "DynamoDB",
    "sql": "SQL",
    "structured query language": "SQL",
    "sql server": "SQL Server",
    "mssql": "SQL Server",
    "ms sql": "SQL Server",
    "microsoft sql server": "SQL Server",

    # Cloud
    "aws": "AWS Cloud",
    "amazon web services": "AWS Cloud",
    "aws cloud": "AWS Cloud",
    "gcp": "Google Cloud",
    "google cloud": "Google Cloud",
    "google cloud platform": "Google Cloud",
    "azure": "Microsoft Azure",
    "ms azure": "Microsoft Azure",
    "microsoft azure": "Microsoft Azure",

    # DevOps
    "docker": "Docker",
    "containerization": "Docker",
    "containers": "Docker",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "terraform": "Terraform",
    "ci/cd": "CI/CD Pipelines",
    "cicd": "CI/CD Pipelines",
    "ci cd": "CI/CD Pipelines",
    "continuous integration": "CI/CD Pipelines",
    "github actions": "GitHub Actions",
    "git": "Git",
    "linux": "Linux",
    "ansible": "Ansible",

    # APIs & Architecture
    "rest": "REST APIs",
    "rest api": "REST APIs",
    "rest apis": "REST APIs",
    "restful": "REST APIs",
    "restful api": "REST APIs",
    "restful apis": "REST APIs",
    "graphql": "GraphQL",
    "grpc": "gRPC",
    "microservices": "Microservices",
    "microservice": "Microservices",
    "system architecture": "System Architecture",
    "system design": "System Architecture",
    "distributed systems": "Distributed Systems",
    "kafka": "Apache Kafka",
    "apache kafka": "Apache Kafka",
    "rabbitmq": "RabbitMQ",

    # Data & AI / ML vs Deep Learning vs Data Analysis vs Data Engineering (Hard Negative protection)
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "nlp": "Natural Language Processing",
    "natural language processing": "Natural Language Processing",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "scikit-learn": "Scikit-Learn",
    "scikit learn": "Scikit-Learn",
    "sklearn": "Scikit-Learn",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "spark": "Apache Spark",
    "apache spark": "Apache Spark",
    "data analysis": "Data Analysis",
    "data analytics": "Data Analysis",
    "data engineering": "Data Engineering",
    "data engineer": "Data Engineering",

    # Project Management vs Product Management (Hard Negative protection)
    "project management": "Project Management",
    "project manager": "Project Management",
    "pmp": "Project Management",
    "product management": "Product Management",
    "product manager": "Product Management",
    "software development": "Software Development",
    "software engineering": "Software Development",

    # CS Core
    "data structures": "Data Structures",
    "dsa": "Data Structures",
    "algorithms": "Algorithms",
    "oop": "Object-Oriented Programming",
    "object oriented programming": "Object-Oriented Programming",
    "design patterns": "Design Patterns",

    # Practices & Soft Skills
    "agile": "Agile Methodology",
    "agile methodology": "Agile Methodology",
    "scrum": "Scrum",
    "tdd": "Test-Driven Development",
    "leadership": "Team Leadership",
    "team leadership": "Team Leadership",
    "communication": "Communication",
    "problem solving": "Problem Solving",

    # ==========================================
    # MULTILINGUAL OFFICIAL & SYNONYM MAPPINGS
    # ==========================================

    # --- Hindi (Devanagari) ---
    "मशीन लर्निंग": "Machine Learning",
    "मशीन अधिगम": "Machine Learning",
    "सॉफ्टवेयर विकास": "Software Development",
    "सॉफ्टवेयर इंजीनियरिंग": "Software Development",
    "डेटा विश्लेषण": "Data Analysis",
    "डेटा एनालिटिक्स": "Data Analysis",
    "डेटा इंजीनियरिंग": "Data Engineering",
    "परियोजना प्रबंधन": "Project Management",
    "उत्पाद प्रबंधन": "Product Management",
    "डेटाबेस": "PostgreSQL",
    "क्लाउड कंप्यूटिंग": "AWS Cloud",
    "आर्टिफिशियल इंटेलिजेंस": "Machine Learning",
    "डीप लर्निंग": "Deep Learning",
    "गहन शिक्षण": "Deep Learning",
    "प्राकृतिक भाषा प्रसंस्करण": "Natural Language Processing",
    "पायथन": "Python",
    "जावा": "Java",
    "जावास्क्रिप्ट": "JavaScript",
    "टाइपस्क्रिप्ट": "TypeScript",
    "रिएक्ट": "React.js",
    "नोड": "Node.js",
    "डॉकर्स": "Docker",
    "डॉकर": "Docker",
    "कुबेरनेट्स": "Kubernetes",
    "एसक्यूएल": "SQL",
    "एजाइल": "Agile Methodology",
    "सिस्टम आर्किटेक्चर": "System Architecture",
    "माइक्रोसर्विसेज": "Microservices",
    "डेटा संरचनाएं": "Data Structures",
    "एल्गोरिदम": "Algorithms",
    "समस्या समाधान": "Problem Solving",
    "संचार": "Communication",

    # --- German (Deutsch / ESCO) ---
    "softwareentwicklung": "Software Development",
    "software-entwicklung": "Software Development",
    "datenanalyse": "Data Analysis",
    "datenanalytik": "Data Analysis",
    "datentechnik": "Data Engineering",
    "projektmanagement": "Project Management",
    "produktmanagement": "Product Management",
    "maschinelles lernen": "Machine Learning",
    "deep learning": "Deep Learning",
    "tiefes lernen": "Deep Learning",
    "künstliche intelligenz": "Machine Learning",
    "datenbank": "PostgreSQL",
    "datenbanken": "PostgreSQL",
    "cloud computing": "AWS Cloud",
    "systemarchitektur": "System Architecture",
    "datenstrukturen": "Data Structures",
    "algorithmen": "Algorithms",
    "agile methoden": "Agile Methodology",
    "agile methodik": "Agile Methodology",
    "problemlösung": "Problem Solving",

    # --- French (Français / ESCO) ---
    "développement logiciel": "Software Development",
    "developpement logiciel": "Software Development",
    "ingénierie logicielle": "Software Development",
    "analyse de données": "Data Analysis",
    "analyse des données": "Data Analysis",
    "ingénierie des données": "Data Engineering",
    "gestion de projet": "Project Management",
    "gestion de projets": "Project Management",
    "gestion de produit": "Product Management",
    "apprentissage automatique": "Machine Learning",
    "apprentissage profond": "Deep Learning",
    "intelligence artificielle": "Machine Learning",
    "traitement du langage naturel": "Natural Language Processing",
    "base de données": "PostgreSQL",
    "bases de données": "PostgreSQL",
    "informatique en nuage": "AWS Cloud",
    "architecture système": "System Architecture",
    "structures de données": "Data Structures",
    "algorithmes": "Algorithms",
    "méthodologie agile": "Agile Methodology",
    "résolution de problèmes": "Problem Solving",

    # --- Spanish (Español / ESCO) ---
    "desarrollo de software": "Software Development",
    "ingeniería de software": "Software Development",
    "análisis de datos": "Data Analysis",
    "analisis de datos": "Data Analysis",
    "ingeniería de datos": "Data Engineering",
    "gestión de proyectos": "Project Management",
    "gestion de proyectos": "Project Management",
    "gestión de producto": "Product Management",
    "aprendizaje automático": "Machine Learning",
    "aprendizaje automatico": "Machine Learning",
    "aprendizaje profundo": "Deep Learning",
    "inteligencia artificial": "Machine Learning",
    "procesamiento del lenguaje natural": "Natural Language Processing",
    "base de datos": "PostgreSQL",
    "bases de datos": "PostgreSQL",
    "computación en la nube": "AWS Cloud",
    "arquitectura de sistemas": "System Architecture",
    "estructuras de datos": "Data Structures",
    "algoritmos": "Algorithms",
    "metodología ágil": "Agile Methodology",
    "resolución de problemas": "Problem Solving",

    # --- Punjabi (Gurmukhi) ---
    "ਮਸ਼ੀਨ ਲਰਨਿੰਗ": "Machine Learning",
    "ਸਾਫਟਵੇਅਰ ਡਿਵੈਲਪਮੈਂਟ": "Software Development",
    "ਡਾਟਾ ਵਿਸ਼ਲੇਸ਼ਣ": "Data Analysis",
    "ਪ੍ਰੋਜੈਕਟ ਮੈਨੇਜਮੈਂਟ": "Project Management",
}


def normalize_skill_name(raw_name: str) -> Tuple[str, str, bool]:
    """
    Normalizes a skill name string into its canonical representation with full Unicode support.

    Returns:
        Tuple[str, str, bool]: (canonical_name, category, is_known)
    """
    if not raw_name or not raw_name.strip():
        return ("", "General", False)

    # Unicode NFKC normalization
    normalized = unicodedata.normalize("NFKC", raw_name.strip())
    lookup_key = normalized.lower()

    # 1. Exact canonical match check (case-insensitive)
    for canonical, category in CANONICAL_SKILLS.items():
        if canonical.lower() == lookup_key:
            return (canonical, category, True)

    # 2. Synonym / Multilingual dictionary match
    if lookup_key in SYNONYM_MAP:
        canonical = SYNONYM_MAP[lookup_key]
        category = CANONICAL_SKILLS.get(canonical, "General")
        return (canonical, category, True)

    # 3. Clean up generic suffixes / prefixes for Latin scripts
    trimmed_lookup = lookup_key
    for suffix in [".js", "js", " framework", " language", " cloud", " database", " development", " engineering"]:
        if trimmed_lookup.endswith(suffix):
            base = trimmed_lookup[: -len(suffix)].strip()
            if base in SYNONYM_MAP:
                canonical = SYNONYM_MAP[base]
                category = CANONICAL_SKILLS.get(canonical, "General")
                return (canonical, category, True)

    # Fallback: preserve original cleaned string as an unknown custom skill
    fallback_name = normalized
    return (fallback_name, "General", False)


class SkillNormalizer:
    """Helper class wrapper around skill normalization functions."""

    def normalize_skill_name(self, raw_name: str) -> str:
        canonical, _, _ = normalize_skill_name(raw_name)
        return canonical

    def normalize_with_metadata(self, raw_name: str) -> Tuple[str, str, bool]:
        return normalize_skill_name(raw_name)


skill_normalizer = SkillNormalizer()
