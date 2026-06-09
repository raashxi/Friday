# Add CORS to server.py
with open("server.py", "r") as f:
    code = f.read()

if "CORSMiddleware" not in code:
    # Add import
    code = code.replace("from fastapi import FastAPI", "from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware")
    # Add CORS middleware after app = FastAPI(...)
    code = code.replace(
        'app = FastAPI(title="FRIDAY API", version="1.0")',
        '''app = FastAPI(title="FRIDAY API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)'''
    )
    with open("server.py", "w") as f:
        f.write(code)
    print("✅ CORS added to server.py")
else:
    print("CORS already present")
