# BeyondChats Full Stack Assignment: AI Content Pipeline

This project is a complete automated content ecosystem developed for the **BeyondChats Internshalla Assignment**. It handles web scraping, automated research via Google Search, AI-driven content enhancement using Gemini LLM, and a dual-view React dashboard.

## 🔗 Live Links
- **Frontend (Live)**: [https://intershalla-354t.vercel.app/](https://intershalla-354t.vercel.app/)
- **Backend API**: [https://intershalla-3.onrender.com](https://intershalla-3.onrender.com)

---

## 📊 Data Flow & Architecture Diagram

```mermaid
graph TD
    A[Phase 1: Scraper] -->|Stores 5 Oldest Blogs| B[(MongoDB Atlas)]
    B --> C[Phase 2: AI Script]
    C -->|Search Title| D[Google Search / SerpAPI]
    D -->|Fetch Top 2 Refs| C
    C -->|Prompt Context| E[Google Gemini LLM]
    E -->|Optimized HTML Content| F[CRUD API - PUT Request]
    F -->|Update Record| B
    B --> G[Phase 3: React Dashboard]
    G -->|Moderate View| H[Full CRUD Operations]
    G -->|Easy View| I[Side-by-Side Version Comparison]
The Flow:
Extraction: The Scraper navigates to the last page of BeyondChats blogs to find the 5 oldest entries.

Research: The AI script identifies top-ranking competitors for each article title.

Synthesis: Gemini LLM rewrites the original content to match the depth and formatting of high-ranking results.

Publishing: The "Updated" versions are saved back to the database with live citations.

Visualization: Users toggle between administrative control and a professional blog UI.

🛠️ Local Setup Instructions
1. Prerequisites
Node.js (v18+)

npm or yarn

MongoDB Atlas Account

2. Clone the Repository
Bash

git clone [https://github.com/kamranoo7/Intershalla.git](https://github.com/kamranoo7/Intershalla.git)
cd Intershalla
3. Environment Configuration
Create a .env file in the root directory (and relevant subfolders):

Code snippet

MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_key
SERPAPI_KEY=your_google_search_api_key
4. Install & Run
Backend:

Bash

cd Backend
npm install
npm start
Frontend:

Bash

cd Frontend/frontend
npm install
npm start
🚀 Phase Implementation Details
Phase 1: Moderate Difficulty (Scraping & CRUD)
Scraper: Uses cheerio to paginate to the end of the BeyondChats blog index to pull historical data.

API: Express.js REST API providing GET, POST, PUT, and DELETE endpoints.

Phase 2: Very Difficult (AI & Research Pipeline)
Search: Integrated SerpAPI to find top-ranking blogs on Google.

LLM: Utilizes gemini-1.5-flash for high-speed, high-quality content generation.

Citations: Automatically appends reference links at the bottom of generated articles.
