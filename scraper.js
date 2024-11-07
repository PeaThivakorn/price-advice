const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

async function scrapeProductData(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const productData = await page.evaluate(() => {
        const productName = document.querySelector('.product-name')?.textContent.trim();
        const productCode = document.querySelector('.product-name-by')?.textContent.trim();
        const productFeatures = Array.from(
            document.querySelectorAll('#product-detail-feature ul li')
        ).map(li => li.textContent.trim());
        
        const imageUrl = document.querySelector('#carousel-selector-1 img')?.getAttribute('src') || null;

        return { productName, productCode, productFeatures, imageUrl };
    });

    await browser.close();
    return productData;
}

app.post('/scrape', async (req, res) => {
    const productId = req.body.productId || 'A0156029';
    const url = `https://www.advice.co.th/product/${productId}`;
    try {
        const productData = await scrapeProductData(url);
        res.json(productData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
