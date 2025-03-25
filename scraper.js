const puppeteer = require("puppeteer");

async function scrapeAmazonProduct(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Scraping logic
  const productData = await page.evaluate(() => {
    const getText = (selector) => document.querySelector(selector)?.innerText.trim() || "N/A";
    const getImages = (selector) =>
      Array.from(document.querySelectorAll(selector)).map(img => img.src);

    return {
      productName: getText("#productTitle"),
      rating: getText(".a-icon-alt"),
      numRatings: getText("#acrCustomerReviewText"),
      sellingPrice: getText(".a-price .a-offscreen"),
      totalDiscount: getText(".priceBlockStrikePriceString"),
      bankOffers: Array.from(document.querySelectorAll(".celwidget .a-text-bold")).map(el => el.innerText),
      aboutThisItem: Array.from(document.querySelectorAll("#feature-bullets ul li")).map(el => el.innerText),
      productInformation: Object.fromEntries(
        Array.from(document.querySelectorAll("#productDetails_techSpec_section_1 tr")).map(row => [
          row.querySelector("th")?.innerText.trim(),
          row.querySelector("td")?.innerText.trim()
        ])
      ),
      productImages: getImages("#altImages img"),
      manufacturerImages: getImages(".a-spacing-medium img"),
      aiReviewSummary: getText("#cr-summarization-attributes-list")
    };
  });

  await browser.close();
  return productData;
}

module.exports = scrapeAmazonProduct;
