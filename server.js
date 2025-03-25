const express = require("express");
const cors = require("cors");
const scrapeAmazonProduct = require("./scraper");

const app = express();
app.use(cors());

app.get("/scrape", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const data = await scrapeAmazonProduct(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Scraping failed", details: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
