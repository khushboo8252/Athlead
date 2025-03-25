const express = require("express");
const cors = require("cors");
const scrapeAmazonProduct = require("./scraper");

const app = express();
app.use(cors());
app.use(express.json()); // Allows parsing of JSON request body

app.post("/scrape", async (req, res) => {
  const { url } = req.body; // Changed from req.query to req.body
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
