"""
FRIDAY Email Brief Agent
Fetches unread emails from Gmail API and generates a spoken summary.
Requires: pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
"""
import os
import pickle
import requests
import json
from datetime import datetime

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_gmail_service():
    """Authenticate and return Gmail API service"""
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    
    return build('gmail', 'v1', credentials=creds)

def fetch_unread_emails(service, max_results=10):
    """Fetch unread emails"""
    results = service.users().messages().list(
        userId='me', q='is:unread', maxResults=max_results
    ).execute()
    messages = results.get('messages', [])
    
    emails = []
    for msg in messages:
        message = service.users().messages().get(
            userId='me', id=msg['id'], format='metadata',
            metadataHeaders=['From', 'Subject', 'Date']
        ).execute()
        headers = message['payload']['headers']
        email_data = {
            'from': next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown'),
            'subject': next((h['value'] for h in headers if h['name'] == 'Subject'), 'No subject'),
            'date': next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown'),
        }
        emails.append(email_data)
    return emails

if __name__ == "__main__":
    print("📧 FRIDAY Email Brief")
    print("This requires Gmail API setup. Run once to authenticate.\n")
    
    try:
        service = get_gmail_service()
        emails = fetch_unread_emails(service)
        
        if not emails:
            print("No unread emails.")
        else:
            print(f"Found {len(emails)} unread emails:\n")
            email_text = ""
            for i, e in enumerate(emails, 1):
                line = f"{i}. From: {e['from']} | Subject: {e['subject']}"
                print(f"  {line}")
                email_text += line + "\n"
            
            # Send to FRIDAY for verbal summary
            prompt = f"""Summarize these unread emails in 2-3 sentences. Start with "Daddy, here's your email summary." Keep it brief and highlight anything important.

{email_text}"""
            
            resp = requests.post("http://localhost:8000/ask",
                json={"question": prompt})
            print(f"\n🤖 {resp.json()['response']}")
            
    except ImportError:
        print("Need Gmail API packages. Run:")
        print("pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib")
    except FileNotFoundError:
        print("\n⚠️  First-time setup needed:")
        print("1. Go to https://console.cloud.google.com/apis/credentials")
        print("2. Create OAuth 2.0 Client ID (Desktop app)")
        print("3. Download as 'credentials.json'")
        print("4. Save to ~/friday_phase0/credentials.json")
