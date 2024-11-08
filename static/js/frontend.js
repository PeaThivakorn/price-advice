async function fetchProductData() {
    const productId = document.getElementById('productId').value;
    if (!productId) {
        alert("Please enter a product ID.");
        return;
    }

    try {
        const response = await fetch('/scrape', { // ใช้เส้นทาง relative
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const productData = await response.json();
        displayProductData(productData);
    } catch (error) {
        console.error('Error fetching product data:', error);
        alert('Failed to fetch product data. Please try again later.');
    }
}


function displayProductData(data) {
    document.querySelector('.container').style.display = 'block';
    document.getElementById('scraper-form').style.display = 'none';
    document.getElementById('title').style.display = 'none';

    document.getElementById('product-code').textContent = data.productCode ?? 'N/A';

    const featuresList = document.getElementById('product-features');
    featuresList.innerHTML = '';
    if (data.productFeatures && data.productFeatures.length > 0) {
        data.productFeatures.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    } else {
        featuresList.innerHTML = '<li>No features available.</li>';
    }

    const imagesDiv = document.getElementById('product-images');
    imagesDiv.innerHTML = '';
    if (data.imageUrl) {
        const img = document.createElement('img');
        img.src = data.imageUrl;
        imagesDiv.appendChild(img);
    }

    // Display CPU, Windows, and Office images based on selection
    document.getElementById('cpuImg').src = document.getElementById('cpuSelect').value || '';
    document.getElementById('windowsImg').src = document.getElementById('windowsSelect').value || '';
    document.getElementById('officeImg').src = document.getElementById('officeSelect').value || '';

    // Display full price and discount price if available
    const fullPrice = document.getElementById('fullPrice').value;
    const discountPrice = document.getElementById('discountPrice').value;

    const priceLeftTop = document.getElementById('price-left-top');
    const priceLeft = document.getElementById('price-left');
    
    // Show crossed out price for full price if it's not empty
    if (fullPrice) {
        priceLeftTop.textContent = `${fullPrice} .-`;
        priceLeftTop.style.textDecoration = discountPrice ? 'line-through' : 'none'; // Cross out if discount available
        priceLeftTop.style.display = 'block'; 
    } else {
        priceLeftTop.style.display = 'none'; 
    }

    // Show the discount price if available
    priceLeft.textContent = discountPrice ? `${discountPrice} .-` : ''; 
}
