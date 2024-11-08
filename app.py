import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
from pyppeteer import launch

app = Flask(__name__)
CORS(app)
PORT = 3000

async def scrape_product_data(url):
    browser = await launch(headless=True)
    page = await browser.newPage()
    await page.goto(url, {'waitUntil': 'networkidle2'})

    product_data = await page.evaluate('''
        () => {
            const productName = document.querySelector('.product-name')?.textContent.trim();
            const productCode = document.querySelector('.product-name-by')?.textContent.trim();
            const productFeatures = Array.from(
                document.querySelectorAll('#product-detail-feature ul li')
            ).map(li => li.textContent.trim());
            
            const imageUrl = document.querySelector('#carousel-selector-1 img')?.getAttribute('src') || null;

            return { productName, productCode, productFeatures, imageUrl };
        }
    ''')

    await browser.close()
    return product_data

@app.route('/scrape', methods=['POST'])
async def scrape():
    data = request.get_json()
    product_id = data.get('productId', 'A0156029')
    url = f'https://www.advice.co.th/product/{product_id}'

    try:
        product_data = await scrape_product_data(url)
        return jsonify(product_data)
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Failed to scrape data'}), 500

if __name__ == '__main__':
    app.run(port=PORT)