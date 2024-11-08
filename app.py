from flask import Flask, request, jsonify, render_template
import os
import nest_asyncio
import asyncio
from flask_cors import CORS
from pyppeteer import launch

# Apply nest_asyncio to allow running async in Flask's dev server
nest_asyncio.apply()

app = Flask(__name__)
CORS(app)

async def scrape_product_data(url):
    try:
        # Launch the browser with necessary arguments for headless operation
        browser = await launch(headless=True, args=[
            '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'
        ])
    except Exception as e:
        print(f"Error launching browser: {e}")
        return {'error': 'Failed to launch browser'}

    try:
        # Create a new page and navigate to the URL
        page = await browser.newPage()
        await page.goto(url, {'waitUntil': 'networkidle2'})
    except Exception as e:
        print(f"Error navigating to page: {e}")
        await browser.close()
        return {'error': 'Failed to navigate to page'}

    try:
        # Extract product data from the page
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
    except Exception as e:
        print(f"Error extracting data from page: {e}")
        await browser.close()
        return {'error': 'Failed to extract data'}

    await browser.close()
    return product_data


@app.route('/')
def index():
    return render_template('index.html')

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
        return jsonify({'error': f'Failed to scrape data: {str(e)}'}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 3000))
    app.run(host='0.0.0.0', port=port)
