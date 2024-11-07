<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Special Promotion</title>
    <link rel="stylesheet" href="/public/css/style.css">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">

</head>
<body>
<h1 id="title">Product Details</h1>

<div id="scraper-form">
    <input type="text" id="productId" placeholder="Enter Product ID (e.g., A0156029)" required>

    <!-- ฟอร์มการเลือก -->
    <label for="cpuSelect">CPU:</label>
    <select id="cpuSelect">
        <option value="">--Select CPU--</option>
        <option value="/public/img/Core_i3.png">Core i3</option>
        <option value="/public/img/Core_i5.png">Core i5</option>
        <option value="/public/img/Core_i7.png">Core i7</option>
        <option value="/public/img/ryzen3.png">Ryzen 3</option>
        <option value="/public/img/ryzen5.png">Ryzen 5</option>
        <option value="/public/img/ryzen7.png">Ryzen 7</option>
    </select>

    <label for="windowsSelect">Windows:</label>
    <select id="windowsSelect">
        <option value="">--Select Windows--</option>
        <option value="/public/img/windows-10.png">Windows 10</option>
        <option value="/public/img/windows-11.png">Windows 11</option>
    </select>

    <label for="officeSelect">Microsoft Office:</label>
    <select id="officeSelect">
        <option value="">--Select Office--</option>
        <option value="/public/img/Office.png">Office 2019</option>
        <option value="/public/img/Office.png">Office 365</option>
    </select>

    <div id="scraper-form">
        <label for="">ราคาเต็ม</label>
        <input type="text" id="fullPrice" placeholder="Enter Full Price" required>
        <label for="">ราคาปรับลด</label>
        <input type="text" id="discountPrice" placeholder="Enter Discount Price">
    </div>
    <button onclick="fetchProductData()">Fetch Product Data</button>
</div>


<div class="container" style="display: none;">
    <div class="header">
        <img src="/public/img/434648116_944479041010917_203762620117639066_n.jpg" alt="">
    </div>

    <div class="left-top">
        <img id="cpuImg" src="" alt="">
    </div>

    <div class="center-main" id="product-images">
    </div>

    <div class="right-top">
        <img id="windowsImg" class="right-top" src="" alt="">
    </div>

    <div class="right-middle">
        <img id="officeImg" class="right-middle" src="" alt="">
    </div>

    <div class="logo" id="product-code"></div>

    <div class="text-long">
        <ul id="product-features"></ul>
    </div>

    <div class="price-left-top" id="price-left-top"></div>
    <div class="price-left" id="price-left"></div>
</div>

    <script>
        async function fetchProductData() {
            const productId = document.getElementById('productId').value;
            if (!productId) {
                alert("Please enter a product ID.");
                return;
            }

            try {
                const response = await fetch('scraper.php', {
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
            }
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
        }
    </script>
</body>
</html>