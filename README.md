# BeyondChats Full Stack Assignment: AI Content Pipeline

This project is a complete automated content ecosystem developed for the **BeyondChats Full Stack Web Developer Intern** assignment. It handles web scraping, automated research via Google Search, AI-driven content enhancement, and a dual-view React dashboard.

## 🔗 Live Links
* **Frontend (Live)**: [https://intershalla-354t.vercel.app/](https://intershalla-354t.vercel.app/)
* **Backend API**: [https://intershalla-3.onrender.com](https://intershalla-3.onrender.com)

---

## 📊 Project Architecture & Data Flow

### 1. The Pipeline Logic
* **Extraction**: The Scraper uses `cheerio` to paginate to the end of the BeyondChats blog index to pull the 5 oldest historical entries.
* **Research & Synthesis**: The AI script (Phase 2) identifies top-ranking competitors for each title using `SerpAPI`, scrapes their content, and uses **Google Gemini LLM** to rewrite the original blog for better SEO and depth.
* **Publishing**: The "Updated" versions are saved back to the database with live citations of the reference articles.

### 2. Architecture Diagram
```text
[ BeyondChats Blog ] --(Scrape)--> [ MongoDB ]
                                      |
         (Search References) <--- [ AI Processor ] ---> (Gemini LLM Rewrite)
                                      |
[ React UI ] <---(Display/CRUD)--- [ Express API ]
⚙️ Local Setup Instructions
1. Prerequisites
Node.js (v18+)

MongoDB Atlas Account

API Keys for Gemini AI and SerpAPI

2. Environment Configuration
Create a .env file in the root directory:

Code snippet

MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_key
SERPAPI_KEY=your_serp_api_google_search_key
3. Installation
Bash

# Clone the repository
git clone [https://github.com/kamranoo7/Intershalla.git](https://github.com/kamranoo7/Intershalla.git)

# Install Backend
cd Backend && npm install

# Install Frontend
cd ../Frontend/frontend && npm install
