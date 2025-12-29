import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai"; // 1. Import Gemini
import 'dotenv/config';

// 2. Initialize Gemini (Ensure GEMINI_API_KEY is in your .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const CRUD_API_BASE_URL = 'http://localhost:5000/api/articles'; 
const SEARCH_API_URL = 'https://serpapi.com/search.json';

async function processArticles() {
  try {
    console.log("--- STEP 1: Fetching 5 Oldest Articles from your Database ---");
    const { data: articles } = await axios.get(CRUD_API_BASE_URL);
    console.log(`Found ${articles.length} articles in database.\n`);

    for (const article of articles) {
      console.log(`\n==========================================================`);
      console.log(`TARGET ARTICLE: "${article.title}"`);
      console.log(`==========================================================`);

      // 1. Scrape original content
      let originalContent = "";
      try {
        const { data: html } = await axios.get(article.link);
        const $ = cheerio.load(html);
        originalContent = $('.entry-content p, .post-content p').map((i, el) => $(el).text()).get().join('\n');
        console.log("✅ Successfully scraped original content.");
      } catch (err) {
        console.error("❌ Could not scrape original content.");
      }

      // 2. Search Google
      console.log("🔍 Searching Google for top-ranking references...");
      const searchRes = await axios.get(SEARCH_API_URL, {
        params: { engine: "google", q: article.title, api_key: process.env.SERPAPI_KEY }
      });
      
      const refLinks = searchRes.data.organic_results?.slice(0, 2).map(res => res.link) || [];
      console.log(`🔗 Found 2 references: \n   1. ${refLinks[0]} \n   2. ${refLinks[1]}`);

      // 3. Scrape References
      const referenceData = [];
      for (const link of refLinks) {
        try {
          const { data: html } = await axios.get(link, { timeout: 5000 });
          const $ = cheerio.load(html);
          const text = $('p').map((i, el) => $(el).text()).get().join('\n').slice(0, 3000);
          referenceData.push(text);
        } catch (e) { console.log(`⚠️  Skipped reference: ${link}`); }
      }

      // 4. LLM Rewrite with Gemini
      console.log("🤖 Generating new article content via Gemini...");
      const prompt = `
        You are a professional blog writer. 
        Old Article: "${article.title}"
        Content: ${originalContent || article.title}
        
        Rewrite this to match the quality of these results:
        Ref 1: ${referenceData[0] || 'N/A'}
        Ref 2: ${referenceData[1] || 'N/A'}
        
        Requirements:
        - Output ONLY HTML (use <h2>, <p>, <ul> tags).
        - Improve depth and SEO.
        - Do not include markdown code blocks like \`\`\`html.
      `;

      let finalVersion = "";
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const newArticleText = response.text();
        
        // Fulfilling the Citation Requirement
        finalVersion = `${newArticleText}<br/><hr/><h3>References Used:</h3><ul><li><a href="${refLinks[0]}">${refLinks[0]}</a></li><li><a href="${refLinks[1]}">${refLinks[1]}</a></li></ul>`;
      } catch (aiErr) {
        console.error("❌ Gemini Error:", aiErr.message);
        finalVersion = `AI generation paused. <a href="${article.link}">View Original Blog</a>`;
      }

      // 5. Update back to your CRUD API
      const articleId = article._id || article.id;
      try {
        await axios.put(`${CRUD_API_BASE_URL}/${articleId}`, {
          ...article,
          title: "NEW: " + article.title,
          content: finalVersion,
          status: "Updated & Published"
        });
        console.log(`✅ DATABASE UPDATED: ${article.title}`);
      } catch (err) {
        console.error(`❌ DB Update Failed: ${err.message}`);
      }
    }
    console.log("\n--- ALL TASKS COMPLETED ---");
  } catch (error) {
    console.error("Critical Error:", error.message);
  }
}

processArticles();