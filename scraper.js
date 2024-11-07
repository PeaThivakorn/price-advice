const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000; // ใช้ PORT จาก environment variable ของ Render

app.use(cors());
app.use(bodyParser.json());

async function scrapeProductData(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
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

        return productData;
    } catch (error) {
        console.error('Error in scrapeProductData:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
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
