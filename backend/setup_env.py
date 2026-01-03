"""
Helper script to create .env file from .env.example
Run this script to set up your environment file.
"""
import os
from pathlib import Path

def create_env_file():
    """Create .env file from .env.example if it doesn't exist."""
    base_dir = Path(__file__).parent
    env_example = base_dir / '.env.example'
    env_file = base_dir / '.env'
    
    if env_file.exists():
        print(".env file already exists. Skipping creation.")
        return
    
    if not env_example.exists():
        # Create a basic .env.example if it doesn't exist
        env_content = """# Django Settings
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Resume Filter Settings
RESUME_SIMILARITY_THRESHOLD=0.70

# AI Model Settings (optional)
SIMILARITY_MODEL=all-MiniLM-L6-v2

# Logging
DJANGO_LOG_LEVEL=INFO
"""
        with open(env_example, 'w') as f:
            f.write(env_content)
        print(f"Created {env_example}")
    
    # Copy .env.example to .env
    with open(env_example, 'r') as f:
        content = f.read()
    
    with open(env_file, 'w') as f:
        f.write(content)
    
    print(f"Created {env_file} from {env_example}")
    print("Please edit .env and update the SECRET_KEY and other settings as needed.")

if __name__ == '__main__':
    create_env_file()



