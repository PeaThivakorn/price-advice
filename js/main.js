
        async function fetchProductData() {
            const productId = document.getElementById('productId').value;
            if (!productId) {
                alert("Please enter a product ID.");
                return;
            }

            try {
                const response = await fetch('https://price-advice.onrender.com/scrape', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId }),
                    timeout: 10000  // เพิ่ม timeout 10 วินาที
                });
                

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const productData = await response.json();
                displayProductData(productData);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        }


        function togglePriceFields() {
            const fullPriceField = document.getElementById('fullPrice');
            const discountPriceField = document.getElementById('discountPrice');
        }

        function displayProductData(data) {
            document.querySelector('.container').style.display = 'block';
            document.getElementById('scraper-form').style.display = 'none';
            document.getElementById('title').style.display = 'none';

            document.getElementById('product-code').textContent = data.productCode || 'N/A';

            const featuresList = document.getElementById('product-features');
            featuresList.innerHTML = '';
            data.productFeatures.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });

            const imagesDiv = document.getElementById('product-images');
            imagesDiv.innerHTML = '';
            if (data.imageUrl) {
                const img = document.createElement('img');
                img.src = data.imageUrl;
                imagesDiv.appendChild(img);
            }

            // Display CPU, Windows, and Office images based on selection
            const cpuSelect = document.getElementById('cpuSelect').value;
            const windowsSelect = document.getElementById('windowsSelect').value;
            const officeSelect = document.getElementById('officeSelect').value;

            document.getElementById('cpuImg').src = cpuSelect || '';
            document.getElementById('windowsImg').src = windowsSelect || '';
            document.getElementById('officeImg').src = officeSelect || '';

            // Get the full price and discount price
            const fullPrice = document.getElementById('fullPrice').value;
            const discountPrice = document.getElementById('discountPrice').value;

            // Show crossed out price for full price if it's not empty
            const priceLeftTop = document.getElementById('price-left-top');
            if (fullPrice) {
                priceLeftTop.textContent = fullPrice + " .-";
                priceLeftTop.style.display = 'block'; // แสดงราคาเต็ม
            } else {
                priceLeftTop.style.display = 'none'; // ซ่อนราคาเต็มถ้าไม่กรอก
            }

            // Show the discount price if available
            if (discountPrice) {
                document.getElementById('price-left').textContent = discountPrice + " .-";
            } else {
                document.getElementById('price-left').textContent = ''; // Clear discount price if not available
            }
        }


