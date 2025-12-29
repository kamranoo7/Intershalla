const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config(); // MUST ADD THIS AT THE TOP

// CHANGE: Use the variable from .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas (Scraper)"))
    .catch(err => console.error("Connection Error:", err));
    const Article = mongoose.model('Article', new mongoose.Schema({
        title: String, 
        link: String, 
        date: String, 
        author: String,
        content: String, // ADD THIS
        status: String   // ADD THIS
    }));

async function scrapeOldestArticles() {
    try {
        const baseUrl = 'https://beyondchats.com/blogs/';
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);

        // Find the highest page number
        let maxPage = 1;
        $('.page-numbers').each((i, el) => {
            const val = parseInt($(el).text());
            if (val > maxPage) maxPage = val;
        });

        let allOldestArticles = [];
        let currentPage = maxPage;

        // Loop backwards through pages until we have at least 5 articles
        while (allOldestArticles.length < 5 && currentPage > 0) {
            const pageUrl = currentPage === 1 ? baseUrl : `${baseUrl}page/${currentPage}/`;
            console.log(`Searching for articles on page ${currentPage}: ${pageUrl}`);
            
            const response = await axios.get(pageUrl);
            const $page = cheerio.load(response.data);
            let pageArticles = [];

            $page('article').each((i, el) => {
                const title = $page(el).find('h2.entry-title a').text().trim();
                const link = $page(el).find('h2.entry-title a').attr('href');
                const author = $page(el).find('li.meta-author').text().trim();
                const date = $page(el).find('li.meta-date').text().trim();

                if (title && link) {
                    pageArticles.push({ title, link, author, date });
                }
            });

            // Since articles on a page are newest-to-oldest, 
            // the oldest on the page are at the end. We reverse to keep chronological order.
            pageArticles.reverse(); 
            
            allOldestArticles = [...allOldestArticles, ...pageArticles];
            currentPage--; // Move to the previous page
        }

        // Trim to exactly the 5 oldest
        const finalFive = allOldestArticles.slice(0, 5);

        if (finalFive.length > 0) {
            await Article.deleteMany({}); 
            await Article.insertMany(finalFive);
            console.log(`Successfully stored the 5 oldest articles across all pages!`);
        } else {
            console.log("No articles found.");
        }

        process.exit();
    } catch (error) {
        console.error("Scraping failed:", error.message);
        process.exit(1);
    }
}

scrapeOldestArticles();