"""
FRIDAY File Organizer Agent
Watches ~/Downloads and auto-organizes files by type.
"""
import os
import time
from pathlib import Path

DOWNLOADS = os.path.expanduser("~/Downloads")
RULES = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    "Documents": [".pdf", ".docx", ".doc", ".txt", ".xlsx", ".pptx", ".csv"],
    "Code": [".py", ".js", ".html", ".css", ".json", ".zip", ".tar.gz"],
    "Media": [".mp4", ".mov", ".avi", ".mp3", ".wav", ".mkv"],
    "Installers": [".dmg", ".pkg", ".app"],
}

def organize():
    moved = []
    for file in os.listdir(DOWNLOADS):
        filepath = os.path.join(DOWNLOADS, file)
        if not os.path.isfile(filepath):
            continue
        
        ext = Path(file).suffix.lower()
        for folder, extensions in RULES.items():
            if ext in extensions:
                dest_dir = os.path.join(DOWNLOADS, folder)
                os.makedirs(dest_dir, exist_ok=True)
                dest = os.path.join(dest_dir, file)
                os.rename(filepath, dest)
                moved.append(f"  {file} → {folder}/")
                break
    
    if moved:
        print(f"📁 Organized {len(moved)} files:")
        for m in moved:
            print(m)
    else:
        print("📁 Nothing to organize.")

if __name__ == "__main__":
    organize()
