<?php

function scrapeProductData($productId) {
    $url = "https://www.advice.co.th/product/" . urlencode($productId);

    // เริ่ม cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    // เก็บ HTML ที่ดึงได้
    $html = curl_exec($ch);
    curl_close($ch);

    if ($html === false) {
        return ["error" => "Failed to fetch data"];
    }

    $dom = new DOMDocument();
    @$dom->loadHTML($html);

    $data = [];

    $nameElement = $dom->getElementById("product-name");
    $data['productName'] = $nameElement ? trim($nameElement->textContent) : 'N/A';

    $codeElement = $dom->getElementById("product-code");
    $data['productCode'] = $codeElement ? trim($codeElement->textContent) : 'N/A';

    $features = [];
    $featureElements = $dom->getElementById("product-detail-feature")?->getElementsByTagName("li");
    if ($featureElements) {
        foreach ($featureElements as $li) {
            $features[] = trim($li->textContent);
        }
    }
    $data['productFeatures'] = $features;

    $imgElement = $dom->getElementById("carousel-selector-1")?->getElementsByTagName("img")->item(0);
    $data['imageUrl'] = $imgElement ? $imgElement->getAttribute("src") : null;

    return $data;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $productId = $input['productId'] ?? 'A0156029';

    header('Content-Type: application/json');
    echo json_encode(scrapeProductData($productId));
}
