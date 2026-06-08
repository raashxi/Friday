import chromadb
from datetime import datetime
import json

class FridayMemory:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./friday_memory")
        self.collection = self.client.get_or_create_collection("conversations")
    
    def remember(self, user_input, response, metadata=None):
        """Store a conversation turn"""
        timestamp = datetime.now().isoformat()
        self.collection.add(
            documents=[f"User: {user_input}\nFRIDAY: {response}"],
            metadatas=[{"timestamp": timestamp, **(metadata or {})}],
            ids=[timestamp]
        )
    
    def recall(self, query, n=3):
        """Search past conversations"""
        results = self.collection.query(query_texts=[query], n_results=n)
        if results["documents"] and results["documents"][0]:
            return results["documents"][0]
        return []
    
    def context_summary(self):
        """Get recent context for the LLM"""
        recent = self.collection.get()
        if recent["documents"]:
            # Return last 3 conversations
            return "\n".join(recent["documents"][-3:])
        return "No previous conversations."

# Test it
if __name__ == "__main__":
    memory = FridayMemory()
    
    # Store a test memory
    memory.remember(
        "What's my name?",
        "Your name is Rashid.",
        {"topic": "personal"}
    )
    
    # Recall it
    results = memory.recall("What is my name")
    print("🔍 Recall results:")
    for r in results:
        print(f"  {r}")
    
    # Get context
    print("\n📝 Recent context:")
    print(memory.context_summary())
