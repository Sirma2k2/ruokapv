const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search/:keyword', async (req, res) => {
    const { keyword } = req.params;
    console.log(`Fetching products for keyword: ${keyword}`);
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodedKeyword}&search_simple=1&action=process&json=1`);
        
        console.log(response.data);

        if (response.data.meals && response.data.meals.length > 0) {
            // Palautetaan vain ensimmäinen ateria ja sen tarvittavat tiedot
            const product = response.data.products[0];
            res.json({
                product_name: product.product_name,
                image_url: product.image_url || "No image available"
            });
        } else {
            res.status(404).json({ message: "No products found for this keyword." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products by keyword", error: error.message });
    }
});

module.exports = router;