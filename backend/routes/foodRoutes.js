const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search/:keyword', async (req, res) => {
    const { keyword } = req.params;
    console.log(`Fetching meals for keyword: ${keyword}`);
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const response = await axios.get(`${process.env.MEALDB_API_URL}/search.php?s=${encodedKeyword}`);
        
        console.log(response.data);

        if (response.data.meals && response.data.meals.length > 0) {
            // Palautetaan vain ensimmäinen ateria ja sen tarvittavat tiedot
            const meal = response.data.meals[0];
            res.json({
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb
            });
        } else {
            res.status(404).json({ message: "No meals found for this keyword." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch meals by keyword", error: error.message });
    }
});

module.exports = router;